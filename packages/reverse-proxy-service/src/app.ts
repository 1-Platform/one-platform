import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import expressWinston from 'express-winston';
import jwtAuth from './middleware/jwtAuth';
import couchDBRouter from './couchdb';
import winstonInstance from './utils/logger';

const app = express();
app.use( expressWinston.logger( {
  winstonInstance,
  statusLevels: true,
} ) );

app.get( '/api', ( _, res ) => {
  res.json( { message: 'This is a proxy service.' } );
} );

app.use( '/api/couchdb', [ cors(), jwtAuth ], couchDBRouter );

app.use( expressWinston.errorLogger( {
  winstonInstance,
  msg: '{{err.message}}',
} ) );

app.use( ( err: Error, req: Request, res: Response, next: NextFunction ) => {
  res.status( 500 ).json( { error: err.message } );
  next();
} );

export default app;
