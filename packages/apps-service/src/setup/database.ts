import mongoose from 'mongoose';
import { MONGO_URL } from './env';

/* Connect database */
export default async function () {
  console.info( '[MongoDB]: Connecting Database...' );
  await connectWithRetry();
  console.info( '[MongoDB]: Database Connected' );
}

/* Handle connection error */
mongoose.connection.on( 'error', error => {
  console.error( `[MongoDB]: Connection failed: ${ error.message }` );
  setTimeout( async () => {
    console.info( '[MongoDB]: Retrying Database connection...' );
    await connectWithRetry();
  }, 5000 );
} );

/* Retry Connection */
async function connectWithRetry() {
  return await mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
}

export { mongoose };
