import dotenv from 'dotenv-safe';
/* If environment is test, set-up the environment variables */
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}

import { ApolloServer, AuthenticationError, ForbiddenError } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { validate as uuidValidate } from 'uuid';
import { stitchedSchemas } from './src/stitch-schema';
import { verifyAPIKey, verifyJwtToken } from './src/verify-token';
import path from 'path';
import helmet from 'helmet';
import {
  getBlacklistIndex,
  initBlacklist,
  isBlacklistEnabled,
} from './src/blacklist/blacklist';
import { extractTokenOwnerClaims } from './src/blacklist/extractUserClaims';
import { extractOwnerClaims } from './src/blacklist/extractOwnerClaims';
import { isUserBlacklisted } from './src/blacklist/isUserBlacklisted';

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

function assertNotBlacklisted( claims: { uid?: string; email?: string } ): void {
  if ( !isBlacklistEnabled() ) {
    return;
  }
  if ( isUserBlacklisted( getBlacklistIndex(), claims ) ) {
    throw new ForbiddenError( 'Access denied' );
  }
}

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
      .then( ( res ) => {
        if ( res.ownerType === 'User' && res.owner ) {
          assertNotBlacklisted( extractOwnerClaims( res.owner ) );
        }
        return { uid: res._id, roles: res.roles, scopes: res.scopes, token };
      } )
      .catch( ( err ) => {
        if ( err instanceof ForbiddenError ) {
          throw err;
        }
        throw new AuthenticationError( err.message );
      } );
  }

  return new Promise( ( resolve, reject ) => {
    verifyJwtToken( token, ( err: any, payload: any ) => {
      if ( err ) {
        reject( new AuthenticationError( err.message ) );
        return;
      }
      try {
        assertNotBlacklisted( extractTokenOwnerClaims( payload ) );
        resolve( {
          uid: payload.rhatUUID,
          roles: payload.role,
          scope: payload.scope?.split( ' ' ),
          token,
        } );
      } catch ( blacklistErr ) {
        reject( blacklistErr );
      }
    } );
  } );
};

/*  Creating the server based on the environment */
const server = http.createServer( app );

async function startGateway(): Promise<void> {
  await initBlacklist();

  const schema = await stitchedSchemas();

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

  apollo.applyMiddleware( { app, path: baseUrl } );
  apollo.installSubscriptionHandlers( server );

  server.listen( port, () => {
    console.log( `Gateway Running on ${ process.env.NODE_ENV } environment at port ${ port }` );
  } );
}

startGateway().catch( err => {
  console.error( err );
  process.exit( 1 );
} );

export default server;
