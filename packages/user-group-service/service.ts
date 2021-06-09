import dotenv from 'dotenv-safe';
/* If environment is test, set-up the environment variables */
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}

import express from 'express';
import { ApolloServer, mergeSchemas } from 'apollo-server-express';
import http from 'http';
import mongoose from 'mongoose';
import * as schedule from 'node-schedule';
const { ApolloLogExtension } = require( 'apollo-log' );
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

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'User Service:'
} ) ];

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

/* Defining the Apollo Server */
const apollo = new ApolloServer( {
  playground: process.env.NODE_ENV !== 'production',
  schema: mergeSchemas( {
    schemas: [
      UserSchema,
      GroupSchema,
      APIKeySchema,
    ],
    resolvers: [
      UserResolver,
      GroupResolver,
      APIKeysResolver,
    ]
  } ),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ( {
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  } ),
  extensions,
} );

/* Applying apollo middleware to express server */
apollo.applyMiddleware( { app } );

/*  Creating the server based on the environment */
const server = http.createServer( app );

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers( server );
export default server.listen( { port: port }, () => {
  console.log( `🚀 Microservice running on ${ process.env.NODE_ENV } at ${ port }${ apollo.graphqlPath }` );
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
