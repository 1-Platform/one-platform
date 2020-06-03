import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from 'graphql-tools';
import http from 'http';
import { verify } from 'jsonwebtoken';
import { publicKey, getRemoteSchema } from './src/helpers';
import cookieParser = require( 'cookie-parser' );

/* Setting port for the server */
const port = process.env.PORT || 4000;
const app = express();

/* Mount cookie parser */
app.use( cookieParser() );

/*  Creating the server based on the environment */
const server = http.createServer( app );

/* Binding the gateway with the apollo server and extracting the schema */
( async () => {
  const userService = await getRemoteSchema( {
    uri: `http://${ process.env.USER_SERVICE_SERVICE_HOST }/graphql`,
    subscriptionsUri: `ws://${ process.env.USER_SERVICE_SERVICE_HOST }/subscriptions`
  } );
  const feedbackService = await getRemoteSchema( {
    uri: `http://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }/graphql`,
    subscriptionsUri: `ws://${ process.env.FEEDBACK_SERVICE_SERVICE_HOST }/subscriptions`
  } );
  const homeService = await getRemoteSchema( {
    uri: `http://${ process.env.HOME_SERVICE_SERVICE_HOST }/graphql`,
    subscriptionsUri: `ws://${ process.env.HOME_SERVICE_SERVICE_HOST }/subscriptions`
  } );

  const notificationService = await getRemoteSchema( {
    uri: `http://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }/graphql`,
    subscriptionsUri: `ws://${ process.env.NOTIFICATIONS_SERVICE_SERVICE_HOST }/subscriptions`
  } );
  const schema = mergeSchemas( {
    schemas: [ userService, feedbackService, homeService, notificationService ]
  } );
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
  const apollo = new ApolloServer( {
    schema: schema,
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
  console.log( `Gateway Running on port ${ port }` );
} );
