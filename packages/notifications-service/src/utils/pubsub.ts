import { REDIS_HOST, REDIS_PORT } from '@setup/env';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

export default new RedisPubSub({
  publisher: redis,
  subscriber: redis,
});
