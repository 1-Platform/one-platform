import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import { stitchSchemas } from 'graphql-tools';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { publicKey, getRemoteSchema } from './src/helpers';
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
( async () => {
  const userService = await getRemoteSchema( {
    uri: `http://${ process.env.USER_SERVICE_SERVICE_HOST }:${ process.env.USER_SERVICE_SERVICE_PORT }/graphql`,
    subscriptionsUri: `ws://${ process.env.USER_SERVICE_SERVICE_HOST }:${ process.env.USER_SERVICE_SERVICE_PORT }/subscriptions`
  } ).catch( err => err );
  const feedbackService = await getRemoteSchema( {
    uri: `http://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }:${ process.env.FEEDBACK_SERVICE_SERVICE_PORT }/graphql`,
    subscriptionsUri: `ws://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }:${ process.env.FEEDBACK_SERVICE_SERVICE_PORT }/subscriptions`
  } ).catch( err => err );
  const homeService = await getRemoteSchema( {
    uri: `http://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/graphql`,
    subscriptionsUri: `ws://${ process.env.HOME_SERVICE_SERVICE_HOST }:${ process.env.HOME_SERVICE_SERVICE_PORT }/subscriptions`
  } ).catch( err => err );
  const notificationService = await getRemoteSchema( {
    uri: `http://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }:${ process.env.NOTIFICATIONS_SERVICE_SERVICE_PORT }/graphql`,
    subscriptionsUri: `ws://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }:${ process.env.NOTIFICATIONS_SERVICE_SERVICE_PORT }/subscriptions`
  } ).catch( err => err );
  const schema = stitchSchemas( {
    schemas: [ userService, feedbackService, homeService, notificationService ]
  } );
  /* Defining the Apollo Server */
  const playgroundOptions: boolean | Object = {
    title: 'API Gateway',
    settings: {
      'request.credentials': 'include'
    }
  };
  const apollo = new ApolloServer( {
    schema: schema,
    introspection: true,
    context: ( { req, res }: any ) => ( { req, res } ),
    formatError: error => ( {
      message: error.message,
      locations: error.locations,
      path: error.path,
      ...error.extensions,
    } ),
    extensions: extensions,
    playground: playgroundOptions,
    tracing: process.env.NODE_ENV !== 'production',
  } );

  /* Applying apollo middleware to express server */
  apollo.applyMiddleware( { app } );
  apollo.installSubscriptionHandlers( server );
} )();

/* Auth Token Verification Check */
app.post( '/graphql', ( req, res, next ) => {
  if ( !req.headers.authorization ) {
    return res.status( 401 ).json( new AuthenticationError( 'Auth Token Missing' ) );
  } else {
    publicKey().then( ( key: string ) => {
      try {
        const tokenArray: any = req.headers.authorization?.split( ` ` );
        const accessToken = tokenArray[ tokenArray.length - 1 ] || req.cookies[ 'access-token' ];
        verify( accessToken, key, { algorithms: [ 'RS256' ] }, ( err: any, payload: any ) => {
          if ( err && err.name === 'TokenExpiredError' ) {
            return res.status( 403 ).json( err );
          } else if ( err && err.name === 'JsonWebTokenError' ) {
            return res.status( 403 ).json( err );
          } else if ( !err ) {
            req.headers = { ...req.headers, tokenPaylod: JSON.stringify( payload ) };
            next();
          }
        } );
      } catch ( err ) {
        return res.status( 403 ).json( err );
      }
    } );
  }
} );

export default server.listen( { port: port }, () => {
  console.log( `Gateway Running on ${ process.env.NODE_ENV } environment at port ${ port }` );
} );
