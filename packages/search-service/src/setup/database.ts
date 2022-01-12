import mongoose from 'mongoose';
import logger from '../lib/logger';

/* App Imports */
import { MONGO_URL } from './env';

/* Retry connection */
const connectWithRetry = async () => mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
);

/* Connect database */
export default async function connectDB() {
  logger.info('SETUP - Connecting database..');

  await connectWithRetry();

  logger.info('Database connected');
}

/* Handle connection error */
mongoose.connection.on('error', (error) => {
  logger.info(`ERROR - Connection failed: ${error.message}`);

  setTimeout(async () => {
    logger.info('SETUP - Connecting database.. retrying..');

    await connectWithRetry();
  }, 5000);
});

export { mongoose };
