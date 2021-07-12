import { ApolloServer, mergeSchemas } from 'apollo-server';
import setupDatabase from './setup/database';
import { PORT } from './setup/env';
import { CommonSchema } from './modules/common';
import { AppsResolver, AppsSchema } from './modules/apps';
import { MicroservicesResolver, MicroservicesSchema } from './modules/microservices';

( async () => {
  /* Initialize database connection */
  await setupDatabase();

  /* Create the GraphQL Server */
  const server = new ApolloServer( {
    onHealthCheck: ( req ) => {
      /* TODO: Add health checks */
      return Promise.resolve( req );
    },
    schema: mergeSchemas( {
      schemas: [
        CommonSchema,
        AppsSchema,
        MicroservicesSchema,
      ],
      resolvers: [
        AppsResolver,
        MicroservicesResolver,
      ]
    } ),
    plugins: [
      {
        requestDidStart: ( requestContext ) => {
          if ( requestContext.request.http?.headers.has( 'x-apollo-tracing' ) ) {
            return;
          }
          const query = requestContext.request.query?.replace( /\s+/g, ' ' ).trim();
          const variables = JSON.stringify( requestContext.request.variables );
          console.log( new Date().toISOString(), `- [AppsService] { query: ${ query }, variables: ${ variables }, operationName: ${ requestContext.request.operationName }}` );
          return;
        },
      },
    ],
    subscriptions: '/subscriptions',
    context: ( { req, connection } ) => {
      if ( req ) {
        return {
          rhatUUID: req.header( 'X-OP-User-ID' )
        };
      }

      if ( connection ) {
        return {
          ...connection.context,
          rhatUUID: connection.context[ 'X-OP-User-ID' ]
        };
      }
    },
  } );

  /* Start the Server */
  server
    .listen( PORT )
    .then( ( { url } ) => {
      console.log( `Server ready at ${ url }` );
    } );
} )();
