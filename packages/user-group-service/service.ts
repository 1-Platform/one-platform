import dotenv from 'dotenv-safe';
/* If environment is test, set-up the environment variables */
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { mergeSchemas } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import * as schedule from 'node-schedule';
/* User Schema and Resolvers */
import UserSchema from './src/users/typedef.graphql';
import { UserResolver } from './src/users/resolver';
/* Group Schema and Resolvers */
import GroupSchema from './src/groups/typedef.graphql';
import { GroupResolver } from './src/groups/resolver';
/* APIKey Schema and Resolvers */
import APIKeySchema from './src/api-keys/typedef.graphql';
import { APIKeysResolver } from './src/api-keys/resolver';

// Crons for Data syncing
import { UserSyncCron } from './src/users/cron';


/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

/* Configuring Mongoose */
mongoose.plugin( ( schema: any ) => { schema.options.usePushEach = true; } );
mongoose.set( 'useNewUrlParser', true );
mongoose.set( 'useFindAndModify', false );
mongoose.set( 'useCreateIndex', true );
mongoose.set( 'useUnifiedTopology', true );

/* Establishing mongodb connection */
const dbCredentials = ( process.env.DB_USER && process.env.DB_PASSWORD )
  ? `${ process.env.DB_USER }:${ process.env.DB_PASSWORD }@`
  : '';
const dbConnection = `mongodb://${ dbCredentials }${ process.env.DB_PATH }/${ process.env.DB_NAME }`;
mongoose.connect( dbConnection, { useNewUrlParser: true, useCreateIndex: true } ).catch( console.error );

mongoose.connection.on( 'error', error => {
  console.error( error );
} );
const schema = mergeSchemas({
  typeDefs: [UserSchema, GroupSchema, APIKeySchema],
  resolvers: [UserResolver, GroupResolver, APIKeysResolver],
});
/* Defining the Apollo Server */
const apolloServer = new ApolloServer({
  schema,
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
});

/* Applying apollo middleware to express server */
apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
});

// Installing the apollo ws subscription handlers
export default app.listen( { port: port }, () => {
  console.log( `🚀 Microservice running on ${ process.env.NODE_ENV } at ${ port }${ apolloServer.graphqlPath }` );
} );

/**
 * Create cron jobs
 *
 */
//  Cron for updating the user data which runs daily
schedule.scheduleJob( '0 0 * * *', () => {
  console.log( `Running User Sync Cron on ${ new Date().toISOString() }` );
  const userSyncCron = new UserSyncCron();
  userSyncCron.syncUsers();
} );
