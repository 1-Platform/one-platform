import { mergeSchemas } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { json } from 'body-parser';
import dotenv from 'dotenv-safe';
import express from 'express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { LighthouseAuditResolver } from './src/audit-manager/resolver';
import auditSchema from './src/audit-manager/typedef.graphql';
import Logger from './src/lib/logger';
import { LHSpaConfigResolver } from './src/lighthouse-spa-config/resolver';
import lhSpaConfigSchema from './src/lighthouse-spa-config/typedef.graphql';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config();
}

const app = express();
const httpServer = createServer(app);

app.use(json());

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
/* Setting port for the server */
const port = process.env.PORT || 8080;

/* Configuring Mongoose */
mongoose.plugin((schema: any) => {
  const schemaConfig = schema;
  schemaConfig.options.usePushEach = true;
  return schemaConfig;
});

/* Establishing mongodb connection */
const dbCredentials = process.env.DB_USER && process.env.DB_PASSWORD
  ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
  : '';
const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;

mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .catch((err: Error) => Logger.error(err));

mongoose.connection.on('error', (error) => {
  Logger.error(error);
});

const schema = mergeSchemas({
  typeDefs: [auditSchema, lhSpaConfigSchema],
  resolvers: [LighthouseAuditResolver, LHSpaConfigResolver],
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
        Logger.http(
          `- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${
            requestContext.request.operationName
          } }`,
        );
      },
    },
  ],
});

SubscriptionServer.create(
  { schema, execute, subscribe } as any,
  { server: httpServer, path: '/subscriptions' },
);

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
});

export default httpServer.listen({ port }, () => {
  Logger.info(`Lighthouse Microservice running on ${process.env.NODE_ENV} at Port ${port} in ${apolloServer.graphqlPath}\n`);
});
