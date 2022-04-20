import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = MongoMemoryServer.create();

export async function setupMockDatabase() {
  const uri = (await mongod).getUri();

  await mongoose.connect(uri);
}

export async function disconnectMockDatabase() {
  await mongoose.disconnect();
}
