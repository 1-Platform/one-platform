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
const { ApolloLogExtension } = require( 'apollo-log' );
import { stitchedSchemas } from './src/schema';
import { verify } from './src/helpers';

/* Setting port for the server */
const port = process.env.PORT || 4000;

const app = express();

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'API Gateway:'
} ) ];

/* include cors middleware */
app.use( cors() );

/*  Creating the server based on the environment */
const server = http.createServer( app );

const context = ({ req, connection }: any) => {
  const authorizationHeader = req?.headers?.authorization || connection?.context?.Authorization;

  if ( !authorizationHeader ) {
    throw new AuthenticationError( 'Auth Token Missing' );
  }

  const token = authorizationHeader.split( ' ' )[ 1 ];

  return verify( token, ( err: any, payload: any ) => {
    if ( err ) {
      throw new AuthenticationError( err.message );
    }
    return payload;
  } );
};

stitchedSchemas()
  .then( schema => {
    /* Defining the Apollo Server */
    const apollo = new ApolloServer( {
      schema,
      context,
      extensions,
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
