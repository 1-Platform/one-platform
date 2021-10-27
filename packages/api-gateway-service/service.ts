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
import path from 'path';
import helmet from 'helmet';

/* Setting base url and port for the server */
const baseUrl = process.env.BASE_URL ?? '/';
const subsciptionsBaseUrl = process.env.SUBSCRIPTIONS_BASE_URL ?? path.join( baseUrl, '/subscriptions' );
const port = process.env.PORT || 4000;

const app = express();

/* Include helmet middleware */
app.use( helmet( {
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': [ "'self'", 'https:' ],
      'script-src': [ "'self'", "'unsafe-inline'", 'cdn.jsdelivr.net' ],
      'img-src': [ "'self'", 'cdn.jsdelivr.net' ],
    },
  }
}) );

/* include cors middleware */
app.use( cors() );

const context = ({ req, connection }: any) => {
  const authorizationHeader = req?.headers?.authorization || connection?.context?.Authorization;

  if ( !authorizationHeader ) {
    throw new AuthenticationError( 'Auth Token Missing' );
  }

  if ( !authorizationHeader.toLowerCase().startsWith( 'bearer' ) ) {
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
      subscriptions: {
        path: subsciptionsBaseUrl,
      },
      schema,
      context,
      introspection: true,
      tracing: process.env.NODE_ENV !== 'production',
      playground: <any>{
        title: 'API Gateway',
        settings: {
          'request.credentials': 'include'
        },
        headers: {
          Authorization: `Bearer <ENTER_API_KEY_HERE>`, /* lgtm [js/hardcoded-credentials] */
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
      formatError: error => ( {
        message: error.message,
        locations: error.locations,
        path: error.path,
        ...error.extensions,
      } ),
    } );

    /* Applying apollo middleware to express server */
    apollo.applyMiddleware( { app, path: baseUrl } );
    apollo.installSubscriptionHandlers( server );
  } )
  .catch( err => {
    console.error( err );
    throw err;
  } );

/*  Creating the server based on the environment */
const server = http.createServer( app );

export default server.listen( port, () => {
  console.log( `Gateway Running on ${ process.env.NODE_ENV } environment at port ${ port }` );
} );
