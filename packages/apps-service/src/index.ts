import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import setupDatabase from './setup/database';
import { PORT } from './setup/env';
import CommonSchema from './modules/common';
import AppsSchema from './modules/apps/schema.gql';
import AppsResolver from './modules/apps/resolver';
import MicroservicesSchema from './modules/microservices/schema.gql';
import logger from './lib/logger';
import MicroservicesResolver from './modules/microservices/resolver';

(async () => {
  /* Initialize database connection */
  await setupDatabase();

  /* Create the GraphQL Server */
  const server = new ApolloServer({
    onHealthCheck: (req) => Promise.resolve(req),
    schema: makeExecutableSchema({
      typeDefs: [CommonSchema, AppsSchema, MicroservicesSchema],
      resolvers: [AppsResolver, MicroservicesResolver],
    }),
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
      rhatUUID: req.header('X-OP-User-ID'),
    }),
  });

  /* Start the Server */
  server
    .listen(PORT)
    .then(({ url }) => {
      logger.info(`Server ready at ${url}`);
    });
})();
