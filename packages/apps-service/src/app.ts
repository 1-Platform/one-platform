import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import CommonSchema from './modules/common';
import ProjectsSchema from './modules/projects/schema.gql';
import ProjectsResolver from './modules/projects/resolver';
import ApplicationsSchema from './modules/application-drawer-entry/schema.gql';
import ApplicationsResolver from './modules/application-drawer-entry/resolver';
import logger from './lib/logger';
import authDirective from './utils/auth-directive';

export const schema = makeExecutableSchema({
  typeDefs: [CommonSchema, ProjectsSchema, ApplicationsSchema],
  resolvers: [ProjectsResolver, ApplicationsResolver],
});
const authDirectiveTransformer = authDirective('auth');

export const getApp = async () => {
  /* Create the GraphQL Server */
  const server = new ApolloServer({
    onHealthCheck: (req) => Promise.resolve(req),
    schema: authDirectiveTransformer(schema),
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
            `[Request Started] { query: "${query?.trim()}", variables: ${variables}, operationName: ${
              requestContext.request.operationName
            } }`
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
      userId: req.headers['x-op-user-id'],
    }),
  });

  return server;
};
