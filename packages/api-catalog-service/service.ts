import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from 'graphql-tools';
import http from 'http';
import mongoose from 'mongoose';
import { NamespaceResolver } from './src/namespace/resolver';
import NamespaceSchema from './src/namespace/typedef.graphql';
import { NSNotificationResolver } from './src/notifications/resolver';
import NSNotificationSchema from './src/notifications/typedef.graphql';
import SharedSchema from './src/shared/typedef.graphql';

import cookieParser = require( 'cookie-parser' );

import { scheduleJob } from 'node-schedule';
import { NamespaceCron } from './src/shared/cron';

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use(cookieParser());

/* Configuring Mongoose */
mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/* Establishing mongodb connection */
const dbCredentials = (process.env.DB_USER && process.env.DB_PASSWORD)
  ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
  : '';
const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;

mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true }).catch(console.error);

mongoose.connection.on('error', error => {
  console.error(error);
});

/* Defining the Apollo Server */
const apollo = new ApolloServer({
  playground: process.env.NODE_ENV !== 'production',
  schema: mergeSchemas( {
    schemas: [
      SharedSchema,
      NamespaceSchema,
      NSNotificationSchema
    ],
    resolvers: [
      NamespaceResolver,
      NSNotificationResolver
    ]
  } ),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  })
});

/* Applying apollo middleware to express server */
apollo.applyMiddleware({ app });

/*  Creating the server based on the environment */
const server =  http.createServer(app);

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers( server );

// Api Catalog Microservice
export default server.listen({ port: port }, () => {
  console.log( '\x1b[32m',`API Catalog Microservice running on ${process.env.NODE_ENV} at ${port}${apollo.graphqlPath}`);
});

// Cron Jobs for the Microservice
scheduleJob( '10 * * * * *', () => {
  console.info( '\x1b[32m',`Running API Hash Sync at ${ new Date().toISOString() }` );
  const nameSpaceCron = new NamespaceCron();
  nameSpaceCron.checkAPIHash();
} );
