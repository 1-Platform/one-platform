import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import { stitchSchemas } from 'graphql-tools';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { getPublicKey, getRemoteSchema } from './src/helpers';
import cors from 'cors';
import cookieParser = require( 'cookie-parser' );
const { ApolloLogExtension } = require( 'apollo-log' );

/* Setting port for the server */
const port = process.env.PORT || 4000;
const app = express();

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'API Gateway:'
} ) ];

/* Mount cookie parser */
app.use( cookieParser() );

/* include cors middleware */
app.use( cors() );

/*  Creating the server based on the environment */
const server = http.createServer( app );

/* Binding the gateway with the apollo server and extracting the schema */
const userService = getRemoteSchema( {
  uri: `http://${ process.env.USER_SERVICE_SERVICE_HOST }:${ process.env.USER_SERVICE_SERVICE_PORT }/graphql`,
  subscriptionsUri: `ws://${ process.env.USER_SERVICE_SERVICE_HOST }:${ process.env.USER_SERVICE_SERVICE_PORT }/subscriptions`
} );
const feedbackService = getRemoteSchema( {
  uri: `http://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }:${ process.env.FEEDBACK_SERVICE_SERVICE_PORT }/graphql`,
  subscriptionsUri: `ws://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }:${ process.env.FEEDBACK_SERVICE_SERVICE_PORT }/subscriptions`
} );
const homeService = getRemoteSchema( {
  uri: `http://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/graphql`,
  subscriptionsUri: `ws://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/subscriptions`
} );
const notificationService = getRemoteSchema( {
  uri: `http://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }:${ process.env.NOTIFICATIONS_SERVICE_SERVICE_PORT }/graphql`,
  subscriptionsUri: `ws://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }:${ process.env.NOTIFICATIONS_SERVICE_SERVICE_PORT }/subscriptions`
} );

const context = ({ req, connection }: any) => {
  const authorizationHeader = req?.headers?.authorization || connection?.context?.Authorization;

  if ( !authorizationHeader ) {
    throw new AuthenticationError( 'Auth Token Missing' );
  }

  const token = authorizationHeader.split( ' ' )[ 1 ];

  return verify( token, getPublicKey(), ( err: any, payload: any ) => {
    if ( err ) {
      throw new AuthenticationError( err );
    }
    return { userData: payload };
  } );
};

Promise.all( [ userService, feedbackService, homeService, notificationService ] )
  .then( schemas => {
    const schema = stitchSchemas( { schemas } );

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
