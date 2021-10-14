import express from 'express';
import { ApolloServer, mergeSchemas } from 'apollo-server-express';
import http from 'http';
import searchConfigSchema from './src/search-config/typedef.graphql';
import { SearchResolver } from './src/search-config/resolver';

import searchMapSchema from './src/search-mapping/typedef.graphql';
import { SearchMapResolver } from './src/search-mapping/resolver';
import database from './src/setup/database';
import initializeAgenda from './src/scripts';
import { NODE_ENV, PORT } from './src/setup/env';

( async function () {
  /* Setup database connection */
  await database();

  /* Setup agenda */
  initializeAgenda();
} )();

const app = express();

/* Defining the Apollo Server */
const apollo = new ApolloServer( {
  playground: NODE_ENV !== 'production',
  schema: mergeSchemas( {
    schemas: [
      searchConfigSchema,
      searchMapSchema
    ],
    resolvers: [
      SearchResolver,
      SearchMapResolver
    ],
  } ),
  subscriptions: {
    path: '/subscriptions',
  },
  formatError: error => ( {
    message: error.message,
    locations: error.locations,
    path: error.path,
    ...error.extensions,
  } ),
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
} );

/* Applying apollo middleware to express server */
apollo.applyMiddleware( { app } );

/*  Creating the server based on the environment */
const server = http.createServer( app );

// Installing the apollo ws subscription handlers
apollo.installSubscriptionHandlers( server );
// Search
export default server.listen( { port: PORT }, () => {
  console.log( `Microservice running on ${ NODE_ENV } at ${ PORT }${ apollo.graphqlPath }` );
} );
