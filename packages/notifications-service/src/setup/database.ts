import { MongoClient } from 'mongodb';
import { MONGO_URL } from '@setup/env';

export const mongodbClient = new MongoClient(MONGO_URL);

export default async function setupDatabaseConnection() {
  console.log('Connecting to MongoDB...');

  await mongodbClient.connect().then(() => {
    console.log('Database Connected');
  });
}
export function disconnectDatabase() {
  return mongodbClient.close();
}

export function getDatabase() {
  return mongodbClient.db();
}

export function getCollection<T>(name: string) {
  return getDatabase().collection<T>(name);
}

export function getNotifications() {
  return getCollection<NotificationType>('notifications');
}

export function getSubscribers() {
  return getCollection<Subscriber>('subscribers');
}

export function getBanners() {
  return getCollection<Banner>('banners');
}
