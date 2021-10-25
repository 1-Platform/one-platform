import mongoose from 'mongoose';
import { MONGO_URL } from './env';
import Logger from '../lib/logger';

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
export default async () => {
  Logger.info('Database connection initiated.\n');
  await connectWithRetry();
  Logger.info('Database connected.\n');
};

/* Handle connection error */
mongoose.connection.on('error', (error) => {
  Logger.info(`ERROR - Connection failed: ${error.message}\n`);
  setTimeout(async () => {
    Logger.info('SETUP - Connecting database.. retrying..\n');
    await connectWithRetry();
  }, 5000);
});

export { mongoose };
