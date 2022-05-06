import session, { MemoryStore } from 'express-session';
import connectRedis, { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import { NODE_ENV, REDIS_HOST, REDIS_PORT } from './env';

let store: MemoryStore | RedisStore;

if (NODE_ENV === 'test') {
  store = new MemoryStore();
} else {
  const RedisStore = connectRedis(session);
  const redisClient = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
  store = new RedisStore({ client: redisClient, ttl: 260 });
}

export default store;
