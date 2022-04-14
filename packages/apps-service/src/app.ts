import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import CommonSchema from './modules/common';
import AppsSchema from './modules/apps/schema.gql';
import AppsResolver from './modules/apps/resolver';
import MicroservicesSchema from './modules/microservices/schema.gql';
import logger from './lib/logger';
import MicroservicesResolver from './modules/microservices/resolver';

export const schema = makeExecutableSchema( {
  typeDefs: [ CommonSchema, AppsSchema, MicroservicesSchema ],
  resolvers: [ AppsResolver, MicroservicesResolver ],
} );

export const getApp = async () => {
  /* Create the GraphQL Server */
  const server = new ApolloServer({
    onHealthCheck: (req) => Promise.resolve(req),
    schema,
    plugins: [
      {
        requestDidStart: (requestContext): any => {
          if (requestContext.request.http?.headers.has('x-apollo-tracing')) {
            return;
          }
          const query = requestContext.request.query
            ?.replace(/\s+/g, ' ')
            .trim();
          const variables = JSON.stringify(requestContext.request.variables);
          logger.info(
            `[Request Started] { query: ${query?.trim()}, variables: ${variables}, operationName: ${requestContext.request.operationName} }`,
          );
        },
      },
    ],
    formatError: (error) => {
      const errorObject = Object.create(error);
      if (errorObject?.extensions?.exception?.stacktrace) {
        errorObject.extensions.exception.stacktrace = undefined;
      }
      return errorObject;
    },
    context: ({ req }) => ({
      rhatUUID: req.headers['X-OP-User-ID'],
    }),
  });

  return server;
};
