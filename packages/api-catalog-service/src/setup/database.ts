import mongoose from 'mongoose';
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
export default async () => {
  process.stdout.write('Database connection initiated.\n');
  await connectWithRetry();
  process.stdout.write('Database connected.\n');
};

/* Handle connection error */
mongoose.connection.on('error', (error) => {
  process.stdout.write(`ERROR - Connection failed: ${error.message}\n`);
  setTimeout(async () => {
    process.stdout.write('SETUP - Connecting database.. retrying..\n');
    await connectWithRetry();
  }, 5000);
});

export { mongoose };
