import mongoose from 'mongoose';
import logger from '../lib/logger';
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
  logger.info('[MongoDB]: Connecting Database...');
  await connectWithRetry();
  logger.info('[MongoDB]: Database Connected');
}

/* Handle connection error */
mongoose.connection.on('error', (error) => {
  logger.error(`[MongoDB]: Connection failed: ${error.message}`);
  setTimeout(async () => {
    logger.info('[MongoDB]: Retrying Database connection...');
    await connectWithRetry();
  }, 5000);
});

export { mongoose };
