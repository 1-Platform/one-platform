import dotenv from 'dotenv-safe';
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import { LighthouseAuditResolver } from './src/lighthouse-audit-manager/resolver';
import gqlSchema from './src/lighthouse-audit-manager/typedef.graphql';

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

/* Defining the Apollo Server */
const apollo = new ApolloServer({
  playground: process.env.NODE_ENV !== 'production',
  typeDefs: gqlSchema,
  resolvers: LighthouseAuditResolver,
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ({
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  }),
  plugins: [
    {
      requestDidStart: ( requestContext ) => {
        if ( requestContext.request.http?.headers.has( 'x-apollo-tracing' ) ) {
          return;
        }
        const query = requestContext.request.query?.replace( /\s+/g, ' ' ).trim();
        const variables = JSON.stringify( requestContext.request.variables );
        console.log( new Date().toISOString(), `- [Request Started] { query: ${ query }, variables: ${ variables }, operationName: ${ requestContext.request.operationName } }` );
        return;
      },
    },
  ]
});

/* Applying apollo middleware to express server */
apollo.applyMiddleware({ app });

/*  Creating the server based on the environment */
const server =  http.createServer(app);

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers(server);
// Lighthouse
export default server.listen({ port: port }, () => {
  console.log(`Lighthouse Microservice running on ${process.env.NODE_ENV} at ${port}${apollo.graphqlPath}`);
});
