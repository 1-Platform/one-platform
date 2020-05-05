import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { serviceList, publicKey } from './src/helpers';
import cookieParser = require( 'cookie-parser' );
const { ApolloLogExtension } = require( 'apollo-log' );
import { verify } from 'jsonwebtoken';

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
  let playgroundOptions: boolean | Object = {
    title: 'API Gateway',
    settings: {
      'request.credentials': 'include'
    }
  };
  if ( process.env.NODE_ENV === 'production' ) {
    playgroundOptions = false;
  }

  /* Auth Token Verification Check */
  app.post( '/graphql', ( req, res, next ) => {
    try {
      publicKey().then( ( key: string ) => {
        console.log( req.headers.authorization );
        if ( !req.headers.authorization ) {
          throw new AuthenticationError( 'Auth Token Missing' );
        }
        const accessToken = req.headers.authorization?.split( ` ` )[ 1 ] || req.cookies[ 'access-token' ];
        verify( accessToken, key, { algorithms: [ 'RS256' ] }, ( err: any, payload: any ) => {
          if ( err && err.name === 'TokenExpiredError' ) {
            return res.status( 401 ).json( err );
          } else if ( err && err.name === 'JsonWebTokenError' ) {
            return res.status( 401 ).json( err );
          } else if ( !err ) {
            next();
          }
        } );
      } );
    } catch ( err ) {
      return res.status( 403 ).json( err );
    }
  } );

  const apollo = new ApolloServer( {
    schema: schema,
    executor: executor,
    introspection: true,
    context: ( { req, res }: any ) => ( { req, res } ),
    formatError: error => ( {
      message: error.message,
      locations: error.locations,
      stack: error.stack ? error.stack.split( '\n' ) : [],
      path: error.path,
    } ),
    playground: playgroundOptions,
    tracing: process.env.NODE_ENV !== 'production',
  },
  );

  /* Applying apollo middleware to express server */
  apollo.applyMiddleware( { app } );
} )();

export default server.listen( { port: port }, () => {
  console.log( `Gateway Running on port ${ port }` );
} );
