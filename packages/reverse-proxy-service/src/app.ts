import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import expressWinston from 'express-winston';
import session from 'express-session';
import rateLimit from 'express-rate-limit'
import jwtAuth from './middleware/jwtAuth';
import couchDBRouter from './couchdb';
import noCorsRouter from './no-cors-proxy'
import restrictedSPAs from './restricted-spas';
import winstonInstance from './utils/logger';
import store from './utils/store';
import { COOKIE_SECRET } from './config/env';
import oidcAuth from './middleware/oidcAuth';
import { requiresAuth } from 'express-openid-connect';

const app = express();

app.set( 'trust proxy', true );

/* Rate limiter to protect from DDOS */
app.use( rateLimit( {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
} ) );

app.use( expressWinston.logger( {
  winstonInstance,
  statusLevels: true,
} ) );

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
  store: store,
  cookie: {
    httpOnly: true,
  }
} ) );

/* OpenID Connect Middleware */
app.use( oidcAuth() );

/* Router for restricted SPAs */
app.get( '*', [ requiresAuth() ], restrictedSPAs );

app.use( expressWinston.errorLogger( {
  winstonInstance,
  msg: '{{err.message}}',
} ) );

app.use( ( err: Error, req: Request, res: Response, next: NextFunction ) => {
  res.status( 500 ).json( { error: err.message } );
  next();
} );

export default app;
