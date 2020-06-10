import { resolve } from 'dns';
import { rejects } from 'assert';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_SERVICE_HOST,
  port: Number.parseInt( process.env.REDIS_SERVICE_PORT || '6379', 10 ),
  retryStrategy: ( times: any ) => {
    return Math.min( times * 50, 2000 );
  }
};
export const pubsub = new RedisPubSub( {
  publisher: new Redis( redisOptions ),
  subscriber: new Redis( redisOptions ),
} );

const JiraApi = require( 'jira-client' );

const JiraObj = new JiraApi( {
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  apiVersion: '2',
  strictSSL: false
} );

export function addFeedback ( issue: any ) {
  return JiraObj.addNewIssue( issue );
}
