import dotenv from 'dotenv-safe';
/* If environment is test, set-up the environment variables */
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}

import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { validate as uuidValidate } from 'uuid';
import { stitchedSchemas } from './src/stitch-schema';
import { verifyAPIKey, verifyJwtToken } from './src/verify-token';

/* Setting port for the server */
const port = process.env.PORT || 4000;

const app = express();

/* include cors middleware */
app.use( cors() );

/*  Creating the server based on the environment */
const server = http.createServer( app );

const context = ({ req, connection }: any) => {
  const authorizationHeader = req?.headers?.authorization || connection?.context?.Authorization;

  if ( !authorizationHeader ) {
    throw new AuthenticationError( 'Auth Token Missing' );
  }

  if ( !authorizationHeader.startsWith( 'Bearer' ) ) {
    throw new AuthenticationError( 'Only Bearer tokens are supported' );
  }

  const token = authorizationHeader.split( ' ' )[ 1 ];

  if ( uuidValidate( token ) ) {
    return verifyAPIKey( token )
      .then( res => ( { uid: res._id }))
      .catch( err => {
        throw new AuthenticationError( err.message );
      } );
  } else {
    return verifyJwtToken( token, ( err: any, payload: any ) => {
      if ( err ) {
        throw new AuthenticationError( err.message );
      }
      return { uid: payload.rhatUUID };
    } );
  }
};

stitchedSchemas()
  .then( schema => {
    /* Defining the Apollo Server */
    const apollo = new ApolloServer( {
      schema,
      context,
      introspection: true,
      formatError: error => ( {
        message: error.message,
        locations: error.locations,
        path: error.path,
        ...error.extensions,
      } ),
      playground: <any>{
        title: 'API Gateway',
        settings: {
          'request.credentials': 'include'
        },
        headers: {
          Authorization: `Bearer <ENTER_API_KEY_HERE>`,
        },
      },
      plugins: [
        {
          requestDidStart: ( requestContext ) => {
            if ( requestContext.request.http?.headers.has( 'x-apollo-tracing' ) ) {
              return;
            }
            console.log( new Date().toISOString(), `- Incoming ${ requestContext.request.http?.method } request from: ${ requestContext.request.http?.headers.get( 'origin' ) || 'unknown' }`, `- via ${ requestContext.request.http?.headers.get( 'user-agent' ) }` );
          }
        }
      ],
      tracing: process.env.NODE_ENV !== 'production',
    } );

    /* Applying apollo middleware to express server */
    apollo.applyMiddleware( { app } );
    apollo.installSubscriptionHandlers( server );
  } )
  .catch( err => {
    console.error( err );
    throw err;
  } );

export default server.listen( { port: port }, () => {
  console.log( `Gateway Running on ${ process.env.NODE_ENV } environment at port ${ port }` );
} );
