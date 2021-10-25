import dotenv from 'dotenv-safe';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from '@graphql-tools/schema';
import cookieParser = require('cookie-parser');
import { json } from 'body-parser';
import morgan from 'morgan';
import NamespaceResolver from './src/namespace/resolver';
import NamespaceSchema from './src/namespace/typedef.graphql';
import SharedSchema from './src/shared/typedef.graphql';
import database from './src/setup/database';
import initializeAgenda from './src/shared/cron';
import Logger from './src/lib/logger';
import { NODE_ENV } from './src/setup/env';

if (NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config();
}

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use(cookieParser());
app.use(json());

(async function setConfig() {
  /* Setup database connection */
  await database();
  await initializeAgenda();
}());

const schema = mergeSchemas({
  typeDefs: [SharedSchema, NamespaceSchema],
  resolvers: [NamespaceResolver],
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

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
        Logger.http(
          `${new Date().toISOString()}- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${
            requestContext.request.operationName
          } }`,
        );
      },
    },
  ],
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
});

export default app.listen({ port }, () => {
  Logger.info(`API Catalog Microservice running on ${NODE_ENV} at Port ${port} in ${apolloServer.graphqlPath}\n`);
});
