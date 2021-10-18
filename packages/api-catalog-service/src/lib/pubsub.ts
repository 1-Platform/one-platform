import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';

const redisOptions: Redis.RedisOptions = {
  host: 'redis',
  port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
  retryStrategy: (times: any) => Math.min(times * 50, 2000),
};

const pubsub = new RedisPubSub({
  publisher: new Redis(redisOptions),
  subscriber: new Redis(redisOptions),
});

export default pubsub;
