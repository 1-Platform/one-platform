import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { mergeSchemas } from 'graphql-tools';
const { ApolloLogExtension } = require( 'apollo-log' );
import mongoose from 'mongoose';

import gqlSchema from './src/typedef.graphql';
import { UserGroupResolver as resolver } from './src/resolver';
import * as schedule from 'node-schedule';
import cookieParser = require( 'cookie-parser' );
import { buildFederatedSchema } from '@apollo/federation';

// Crons for Data syncing
import { UserSyncCron } from './src/cron';

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use( cookieParser() );

const extensions = [ () => new ApolloLogExtension( {
  level: 'info',
  timestamp: true,
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
  schema: buildFederatedSchema( [ {
    typeDefs: gqlSchema,
    resolvers: resolver
  } ] ),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ( {
    message: error.message,
    locations: error.locations,
    stack: error.stack ? error.stack.split( '\n' ) : [],
    path: error.path,
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
