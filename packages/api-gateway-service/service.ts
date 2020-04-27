import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { serviceList } from './src/helpers';
import cookieParser = require( 'cookie-parser' );
const { ApolloLogExtension } = require( 'apollo-log' );

/* Setting port for the server */
const port = process.env.PORT || 4000;
const app = express();

/* Mount cookie parker */
app.use( cookieParser() );

// Logging extension for gateway
const loggingExtension = [ () => new ApolloLogExtension( {
  level: 'info',
  timestamp: true,
} ) ];

/* Defining the Apollo Gateway */
const apiGateway = new ApolloGateway( {
  serviceList: serviceList
} );

/*  Creating the server based on the environment */
const server = process.env.NODE_ENV !== 'test'
  ? https.createServer(
    {
      key: fs.readFileSync( ( process.env.SSL_KEY ) ? `${ process.env.SSL_KEY }` : '' ),
      cert: fs.readFileSync( ( process.env.SSL_CERT ) ? `${ process.env.SSL_CERT }` : '' )
    },
    app
  )
  : http.createServer( app );

/* Binding the gateway with the apollo server and extracting the schema */
( async () => {
  const { schema, executor } = await apiGateway.load();
  /* Defining the Apollo Server */
  const apollo = new ApolloServer( {
    schema: schema,
    executor: executor,
    playground: process.env.NODE_ENV !== 'production',
    subscriptions: false,
    tracing: process.env.NODE_ENV !== 'production',
  },
  );
  /* Applying apollo middleware to express server */
  apollo.applyMiddleware( { app } );
} )();

export default server.listen( { port: port }, () => {
  console.log( `Gateway Running on port ${ port }` );
} );
