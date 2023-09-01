require('events').defaultMaxListeners = 70;
import {Redis} from 'ioredis';

export const redisConnection = new Redis({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT ?? '6379'),
  maxRetriesPerRequest: null,
});
