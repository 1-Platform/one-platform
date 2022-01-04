import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import expressWinston from 'express-winston';
import session from 'express-session';
import jwtAuth from './middleware/jwtAuth';
import couchDBRouter from './couchdb';
import noCorsRouter from './no-cors-proxy'
import restrictedSPAs from './restricted-spas';
import winstonInstance from './utils/logger';
import keycloak, { memoryStore } from './utils/keycloakAuth';
import { COOKIE_SECRET } from './config/env';

const app = express();
app.use( expressWinston.logger( {
  winstonInstance,
  statusLevels: true,
} ) );
app.set( 'trust proxy', true );

app.get( '/api', ( _, res ) => {
  res.json( { message: 'This is a proxy service.' } );
} );

app.use( '/api/couchdb', [ cors(), jwtAuth ], couchDBRouter );

app.use( '/api/no-cors-proxy', [ cors() ], noCorsRouter );

/* Setting up session for keycloak */
app.use( session( {                                 // lgtm[js/clear-text-cookie]
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
  cookie: {
    httpOnly: true,
  }
} ) );
app.use( keycloak.middleware({ logout: '/' }) );

/* Router for restricted SPAs */
app.get( '*', restrictedSPAs );

app.use( expressWinston.errorLogger( {
  winstonInstance,
  msg: '{{err.message}}',
} ) );

app.use( ( err: Error, req: Request, res: Response, next: NextFunction ) => {
  res.status( 500 ).json( { error: err.message } );
  next();
} );

export default app;
