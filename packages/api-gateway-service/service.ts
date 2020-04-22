import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import { ApolloGateway } from '@apollo/gateway';
import cookieParser = require( 'cookie-parser' );
import { serviceList } from './src/helpers';
const { ApolloLogExtension } = require( 'apollo-log' );

import { verify } from 'jsonwebtoken';

/* Setting port for the server */
const port = process.env.PORT || 4000;
const app = express();

/* Mount cookie parker */
app.use( cookieParser() );

/* Auth Token Verification */
// app.use( ( req, res, next ) => {
//   publicKey().then( ( key: string ) => {
//     console.log( key );
//     const accessToken = req.cookies[ 'access-token' ];
//     if ( !accessToken ) {
//       return next();
//     }

//     try {
//       const data = verify( accessToken, key ) as any;
//       console.log( accessToken, data );
//       return next();
//     } catch { }
//   } );
//   next();
// } );

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
    context: ( { req, res }: any ) => ( { req, res } ),
    tracing: process.env.NODE_ENV !== 'production',
    extensions: loggingExtension
  },
  );

  /* Applying apollo middleware to express server */
  apollo.applyMiddleware( { app } );
  server.listen( { port: port }, () => {
    console.log( `Gateway Running on port ${ port }` );
  } );
} )();

export default server;
