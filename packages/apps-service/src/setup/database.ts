import mongoose from 'mongoose';
import Logger from '../lib/logger';
import { MONGO_URL } from './env';

/* Retry Connection */
async function connectWithRetry() {
  return mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
  );
}
/* Connect database */
export default async function setupDatabase() {
  Logger.info('[MongoDB]: Connecting Database...');
  await connectWithRetry();
  Logger.info('[MongoDB]: Database Connected');
}

/* Handle connection error */
mongoose.connection.on('error', (error) => {
  Logger.error(`[MongoDB]: Connection failed: ${error.message}`);
  setTimeout(async () => {
    Logger.info('[MongoDB]: Retrying Database connection...');
    await connectWithRetry();
  }, 5000);
});

export { mongoose };
