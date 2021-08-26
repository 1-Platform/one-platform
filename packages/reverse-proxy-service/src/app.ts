import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import jwtAuth from './middleware/jwtAuth';
import couchDBRouter from './couchdb';

const app = express();
app.use( morgan( 'dev' ) );

app.get( '/api', ( _, res ) => {
  res.json( { message: 'This is a proxy service.' } );
} );

app.use( '/api/couchdb', [ cors(), jwtAuth ], couchDBRouter );

export default app;
