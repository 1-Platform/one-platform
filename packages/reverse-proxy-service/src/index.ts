import app from './app';
import { PORT } from './config/env';

app.listen( PORT, () => {
  console.log( `Reverse proxy listening on port ${PORT}` );
} );
