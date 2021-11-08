import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import setupDatabase from './setup/database';
import { PORT } from './setup/env';
import CommonSchema from './modules/common';
import AppsSchema from './modules/apps/schema.gql';
import AppsResolver from './modules/apps/resolver';
import MicroservicesSchema from './modules/microservices/schema.gql';
import Logger from './lib/logger';
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
          Logger.http(
            `- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${requestContext.request.operationName} }`,
          );
        },
      },
    ],
    context: ({ req }) => ({
      rhatUUID: req.header('X-OP-User-ID'),
    }),
  });

  /* Start the Server */
  server
    .listen(PORT)
    .then(({ url }) => {
      Logger.info(`Server ready at ${url}`);
    });
})();
