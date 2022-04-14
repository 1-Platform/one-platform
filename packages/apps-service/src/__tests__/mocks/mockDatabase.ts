import { MongoMemoryServer } from 'mongodb-memory-server';
import { mongoose, mongooseOpts } from '../../setup/database';

const mongod = MongoMemoryServer.create();

export async function setupMockDatabase () {
  const uri = (await mongod).getUri();

  await mongoose.connect( uri, mongooseOpts );
}

export async function disconnectMockDatabase () {
  await mongoose.disconnect();
}
