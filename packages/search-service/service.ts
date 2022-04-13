import { mergeSchemas } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import logger from './src/lib/logger';
import initializeAgenda from './src/scripts';
import { SearchResolver } from './src/search-config/resolver';
import searchConfigSchema from './src/search-config/typedef.graphql';
import { SearchMapResolver } from './src/search-mapping/resolver';
import searchMapSchema from './src/search-mapping/typedef.graphql';
import database from './src/setup/database';
import { NODE_ENV, PORT } from './src/setup/env';

(async function setConfig() {
  /* Setup database connection */
  await database();

  /* Setup agenda */
  initializeAgenda();
}());

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
const schema = mergeSchemas({
  typeDefs: [searchConfigSchema, searchMapSchema],
  resolvers: [SearchResolver, SearchMapResolver],
});
/* Defining the Apollo Server */
const apolloServer = new ApolloServer({
  schema,
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
  plugins: [
    {
      requestDidStart: (requestContext):any => {
        if (requestContext.request.http?.headers.has('x-apollo-tracing')) {
          return;
        }
        const query = requestContext.request.query?.replace(/\s+/g, ' ').trim();
        const variables = JSON.stringify(requestContext.request.variables);
        logger.info(`${new Date().toISOString()}- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${
          requestContext.request.operationName
        } }`);
      },
    },
  ],
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
});

export default app.listen({ port: PORT }, () => {
  logger.info(`Search Microservice running on ${NODE_ENV} at ${PORT} in ${apolloServer.graphqlPath}`);
});
