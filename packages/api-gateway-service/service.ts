import { ApolloServer, AuthenticationError, PlaygroundConfig } from 'apollo-server-express';
import express from 'express';
import { stitchSchemas } from 'graphql-tools';
import http from 'http';
import { verify, sign } from 'jsonwebtoken';
import { publicKey, getRemoteSchema } from './src/helpers';
import cors from 'cors';
import cookieParser = require( 'cookie-parser' );
const { ApolloLogExtension } = require( 'apollo-log' );
const basicAuth = require( 'basic-auth');

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

let playgroundOptions: any = {
  title: 'API Gateway',
  settings: {
    'request.credentials': 'include'
  },
  headers: {
    'Authorization':`Bearer`
  }
};

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

  const verifyLocalJWT = (res:any, accessToken: any) => {
    verify(accessToken, JSON.stringify(process.env.JWT_TOKEN),( err: any, payload: any ) => {
      if ( err && err.name === 'TokenExpiredError' ) {
        return res.status( 403 ).json( err );
      } else if ( err && err.name === 'JsonWebTokenError' ) {
        return res.status( 403 ).json( err );
      }
    });
  }
  const context = ( { req, res }: any ) => {
    if ( req.headers.authorization || req.cookies[ 'access-token' ] ) {
      const tokenArray: any = req.headers.authorization?.split( ` ` );
      const accessToken = tokenArray[ tokenArray.length - 1 ] || req.cookies[ 'access-token' ];
      try {
        return publicKey().then( ( key: string ) => {
          verify( accessToken, key, { algorithms: [ 'RS256' ] }, ( err: any, payload: any ) => {
            if ( err && err.name === 'TokenExpiredError' ) {
              verifyLocalJWT(res, accessToken)
              getAuthenticatedUserDetails(req);
            } else if ( err && err.name === 'JsonWebTokenError' ) {
              verifyLocalJWT(res, accessToken)
              getAuthenticatedUserDetails(req);
            } else if ( !err ) {
              req.headers = { ...req.headers, tokenPayload: JSON.stringify( payload ) };
            }
          } );
        })
      } catch (err) {
        throw new AuthenticationError('Auth token is invalid')
      }
  } else {
    return res.status( 401 ).json( new AuthenticationError( 'Auth Token Missing' ) );
  }
};

  /* Defining the Apollo Server */  
  const apollo = new ApolloServer( {
    schema: schema,
    introspection: true,
    context: context,
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


const getAuthenticatedUserDetails =  (req: express.Request) => {
  const cred = basicAuth(req) ? basicAuth(req) : null;
  const user = cred ? { name: cred.name, password: cred.pass } : { name: null, pass: null };
  const validUsers = { name: process.env.API_USER, password:process.env.API_PASS };
  if( JSON.stringify(user) === JSON.stringify(validUsers)) {
    return user;
  } else {
    return null;
  }
};

app.get('/graphql', (req, res, next) => {
  if ('OPTIONS' === req.method) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
  } else {
    const user = getAuthenticatedUserDetails(req);
    if (!user || !user.name || !user.password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      res.status(401);
      res.send({'message': 'Unauthorized for playground access'});
      return;
    } else if (user) {
      const accessToken = sign({ user: user.name }, JSON.stringify( process.env.JWT_TOKEN ), { expiresIn: "2h" });
      playgroundOptions.headers.Authorization = `Bearer ${ accessToken }`;
      next();
    }
  }
});

export default server.listen( { port: port }, () => {
  console.log( `Gateway Running on ${ process.env.NODE_ENV } environment at port ${ port }` );
} );
