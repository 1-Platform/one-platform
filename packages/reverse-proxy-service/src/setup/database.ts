import { MongoClient, Document } from 'mongodb';
import { APPS_DB_COLLECTION, APPS_DB_NAME, MONGO_URL } from './env';
import logger from './logger';

export const mongodbClient = new MongoClient(MONGO_URL);

export default async function setupDatabaseConnection() {
  logger.info('Connecting to MongoDB...');
  await mongodbClient.connect().then(() => {
    logger.info('Database Connected');
  });
}
export function disconnectDatabase() {
  return mongodbClient.close();
}

export function getDatabase() {
  return mongodbClient.db(APPS_DB_NAME);
}

export function getCollection<T extends Document>(name: string) {
  return getDatabase().collection<T>(name);
}

type Apps = {
  name: string;
  path: string;
  authenticate: boolean;
  isActive: boolean;
};
export function getApps() {
  return getDatabase().collection<Apps>(APPS_DB_COLLECTION);
}
