import dotenv from 'dotenv-safe';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from 'graphql-tools';
import http from 'http';
import cookieParser = require('cookie-parser');
import NamespaceResolver from './src/namespace/resolver';
import NamespaceSchema from './src/namespace/typedef.graphql';
import SharedSchema from './src/shared/typedef.graphql';
import database from './src/setup/database';
import initializeAgenda from './src/shared/cron';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config();
}

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use(cookieParser());

(async function setConfig() {
  /* Setup database connection */
  await database();

  await initializeAgenda();
}());

/* Defining the Apollo Server */
const apollo = new ApolloServer({
  schema: mergeSchemas({
    schemas: [
      SharedSchema,
      NamespaceSchema,
    ],
    resolvers: [
      NamespaceResolver,
    ],
  }),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: (error) => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
});

/* Applying apollo middleware to express server */
apollo.applyMiddleware({ app });

/*  Creating the server based on the environment */
const server = http.createServer(app);

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers(server);

// Api Catalog Microservice
export default server.listen({ port }, () => {
  process.stdout.write(`API Catalog Microservice running on ${process.env.NODE_ENV} at ${port}${apollo.graphqlPath}\n`);
});
