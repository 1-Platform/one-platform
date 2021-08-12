import { Server } from 'http';
import app from '../app';
import { PORT } from '../config/env';

let server: Server;

export function startServer () {
  server = app.listen( PORT );
  return server;
}

export function stopServer () {
  if ( server ) {
    server.close();
  }
}
