import dotenv from 'dotenv-safe';
if ( process.env.NODE_ENV === 'test' ) {
  dotenv.config( { path: '.test.env' } );
} else {
  dotenv.config();
}
import { ApolloServer, mergeSchemas } from 'apollo-server-express';
import mongoose from 'mongoose';
import express from 'express';
import http from 'http';

import { LighthouseAuditResolver } from './src/audit-manager/resolver';
import { PropertyResolver } from './src/property-manager/resolver';
import { LHSpaConfigResolver } from './src/lighthouse-spa-config/resolver';

import auditSchema from './src/audit-manager/typedef.graphql';
import propertySchema from './src/property-manager/typedef.graphql';
import lhSpaConfigSchema from './src/lighthouse-spa-config/typedef.graphql';
/* Setting port for the server */
const port = process.env.PORT || 8080;

/* Configuring Mongoose */
mongoose.plugin((schema: any) => {
  schema.options.usePushEach = true;
});

/* Establishing mongodb connection */
const dbCredentials =
  process.env.DB_USER && process.env.DB_PASSWORD
    ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
    : "";
const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;

mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch(console.error);

mongoose.connection.on("error", (error) => {
  console.error(error);
});

const app = express();

/* Defining the Apollo Server */
const apollo = new ApolloServer({
  playground: process.env.NODE_ENV !== "production",
  schema: mergeSchemas({
    schemas: [auditSchema, propertySchema, lhSpaConfigSchema],
    resolvers: [LighthouseAuditResolver, PropertyResolver, LHSpaConfigResolver],
  }),
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
