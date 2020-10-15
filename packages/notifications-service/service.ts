import dotenv from 'dotenv-safe';
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}

import express from 'express';
import { ApolloServer, mergeSchemas } from 'apollo-server-express';
import http from 'http';
import { ApolloLogExtension } from 'apollo-log';
import mongoose from 'mongoose';

import NotificationConfigSchema from './src/notificationConfig/typedef.graphql';
import NotificationsSchema from './src/typedef.graphql';
import { NotificationConfigResolver } from './src/notificationConfig/resolver';
import { NotificationsResolver } from './src/resolver';
import { NotificationsBroadcaster } from './src/broadcaster';

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'apollo:'
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

mongoose.connection.on( 'error', console.error );

/* Defining the Apollo Server */
const apollo = new ApolloServer( {
  playground: process.env.NODE_ENV !== 'production',
  schema: mergeSchemas( {
    schemas: [
      NotificationConfigSchema,
      NotificationsSchema
    ],
    resolvers: [
      NotificationConfigResolver,
      NotificationsResolver
    ]
  } ),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => {
    return ( {
      message: error.message,
      locations: error.locations,
      path: error.path,
      ...error.extensions,
    } );
  },
  extensions
} );

/* Applying apollo middleware to express server */
apollo.applyMiddleware( { app } );

/*  Creating the server based on the environment */
const server = http.createServer( app );

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers( server );
// Notifications
export default server.listen( { port }, () => {
  console.log( `Microservice running on ${ process.env.NODE_ENV } at ${ port }${ apollo.graphqlPath }` );

  /* Start the broadcasting service once the server starts */
  new NotificationsBroadcaster( dbConnection ).start();
} );
