const fetch = require( 'node-fetch' );
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { introspectSchema, makeRemoteExecutableSchema } from 'apollo-server-express';
import { getMainDefinition } from 'apollo-utilities';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';
export const pubsub = new RedisPubSub();

export async function getRemoteSchema ( { uri, subscriptionsUri }: any ) {
  const httpLink = new HttpLink( { uri, fetch } );

  /* Create WebSocket link with custom client */
  const client = new SubscriptionClient( subscriptionsUri, { reconnect: true }, ws );
  const wsLink = new WebSocketLink( client );
  /* Using the ability to split links, we can send data to each link depending on what kind of operation is being sent */
  const link = split(
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
export const publicKey = () => {
  return fetch( process.env.INTERNAL_IDP )
    .then( ( res: any ) => res.json() )
    .then( ( res: any ) => {
      return `-----BEGIN PUBLIC KEY-----
${ res.public_key }
-----END PUBLIC KEY-----`;
    } );
};
