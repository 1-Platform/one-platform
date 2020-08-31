import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
const { ApolloLogExtension } = require('apollo-log');

import gqlSchema from './src/typedef.graphql';
import { SearchResolver as resolver } from './src/resolver';
import cookieParser = require('cookie-parser');

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

// Mount cookie parser
app.use(cookieParser());

const extensions = [ () => new ApolloLogExtension( {
  level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
  timestamp: true,
  prefix: 'apollo:'
} ) ];


/* Defining the Apollo Server */
const apollo = new ApolloServer({
  playground: process.env.NODE_ENV !== 'production',
  typeDefs: gqlSchema,
  resolvers: resolver,
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
  extensions
});

/* Applying apollo middleware to express server */
apollo.applyMiddleware({ app });

/*  Creating the server based on the environment */
const server = http.createServer(app);

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers(server);
// Search
export default server.listen({ port: port }, () => {
  console.log(`Microservice running on ${process.env.NODE_ENV} at ${port}${apollo.graphqlPath}`);
});
