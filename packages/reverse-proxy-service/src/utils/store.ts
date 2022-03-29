import session, { MemoryStore } from 'express-session';
import connectRedis, { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import { NODE_ENV, REDIS_HOST, REDIS_PORT } from '../config/env';

let store: MemoryStore | RedisStore;

if ( NODE_ENV === 'test' ) {
  store = new MemoryStore();
} else {
  const RedisStore = connectRedis( session );
  const client = new Redis( { host: REDIS_HOST, port: REDIS_PORT } );
  store = new RedisStore( { client: client, ttl: 260 } );
}

export default store;
