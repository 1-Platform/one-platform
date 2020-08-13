const fetch = require( 'node-fetch' );
import { HttpLink } from 'apollo-link-http';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { introspectSchema, makeRemoteExecutableSchema } from 'apollo-server-express';
import { getMainDefinition } from 'apollo-utilities';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
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

export async function getRemoteSchema ( { uri, subscriptionsUri }: any ) {
  const httpLink = new HttpLink( { uri, fetch } );

  /* Create WebSocket link with custom client */
  const client = new SubscriptionClient( subscriptionsUri, { reconnect: true }, ws );
  const wsLink = new WebSocketLink( client );
  const link = new RetryLink( {
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true
    },
    attempts: {
      max: 5,
      retryIf: ( error, _operation ) => !!error
    }
  } ).split(
    ( operation: any ) => {
      const definition = getMainDefinition( operation.query );
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );
  const schema = await introspectSchema( httpLink );
  const executableSchema = makeRemoteExecutableSchema( { schema, link } );
  return executableSchema;
}

/* Function to fetch the public key from internal IDP */
const formatAsPem = (str: any) => {
  const keyHeader = '-----BEGIN PUBLIC KEY-----';
  const keyFooter = '-----END PUBLIC KEY-----';
  let formatKey = '';
  if ( str.startsWith( keyHeader ) && str.endsWith( keyFooter ) ) {
    return str;
  }

  if ( str.split( '\n' ).length === 1 ) {
    while ( str.length > 0 ) {
      formatKey += `${ str.substring( 0, 64 ) }\n`;
      str = str.substring( 64 );
    }
  }

  return `${ keyHeader }\n${ formatKey }${ keyFooter }`;
};

export function getPublicKey(): string {
  const publicKey = process.env.KEYCLOAK_PUBKEY;

  if ( publicKey && publicKey.trim().length > 0 ) {
    return formatAsPem( publicKey );
  }
  throw Error( 'No Keycloak Public Key found! Please configure it by setting the KEYCLOAK_PUBKEY environment variable.' );
};
