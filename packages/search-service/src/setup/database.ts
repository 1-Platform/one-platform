import mongoose from 'mongoose';

/* App Imports */
import { MONGO_URL } from './env';

/* Connect database */
export default async function () {
  console.info( 'SETUP - Connecting database..' );

  await connectWithRetry();

  console.log( 'Database connected' );
}

/* Handle connection error */
mongoose.connection.on( 'error', error => {
  console.log( `ERROR - Connection failed: ${ error.message }` );

  setTimeout( async () => {
    console.log( 'SETUP - Connecting database.. retrying..' );

    await connectWithRetry();
  }, 5000 );
} );

/* Retry connection */
const connectWithRetry = async () => {
  return await mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  );
};

export { mongoose };
