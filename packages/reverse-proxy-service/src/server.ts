import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import expressWinston from 'express-winston';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import jwtAuth from './middleware/jwtAuth';
import couchDBRouter from './couchdb';
import noCorsRouter from './no-cors-proxy';
import restrictedSPAs from './restricted-spas';
import winstonInstance from './setup/logger';
import store from './setup/store';
import { COOKIE_SECRET } from './setup/env';
import oidcAuth from './middleware/oidcAuth';
import { updateApplicationCache } from './utils/applicationCache';

const getServer = async () => {
  const server = express();

  server.set('trust proxy', true);

  /* Rate limiter to protect from DDOS */
  server.use(
    rateLimit({
      windowMs: 2 * 60 * 1000, // 2 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 2 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })
  );

  server.use(
    expressWinston.logger({
      winstonInstance,
      statusLevels: true,
    })
  );

  server.get('/api', (_, res) => {
    res.json({ message: 'This is a proxy service.' });
  });

  server.use('/api/couchdb', [cors(), jwtAuth], couchDBRouter);

  server.use('/api/no-cors-proxy', [cors()], noCorsRouter);

  /* Setting up session for keycloak */
  server.use(
    session({ // lgtm[js/clear-text-cookie]
      secret: COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      store: store,
      cookie: {
        httpOnly: true,
      },
    })
  );

  /* OpenID Connect Middleware */
  server.use(oidcAuth());

  /* Build initial application cache */
  await updateApplicationCache();
  /* Update application cache every 15 seconds */
  const intervalId = setInterval(updateApplicationCache, 15 * 1000); // update cache every 15 seconds
  server.on('close', () => {
    clearInterval(intervalId);
  });

  /* Router for restricted SPAs */
  server.get('*', restrictedSPAs);

  server.use(
    expressWinston.errorLogger({
      winstonInstance,
      msg: '{{err.message}}',
    })
  );

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: err.message });
    next();
  });

  return server;
};

export default getServer;
