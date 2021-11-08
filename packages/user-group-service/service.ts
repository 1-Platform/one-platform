import { mergeSchemas } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv-safe';
import express from 'express';
import mongoose from 'mongoose';
import * as schedule from 'node-schedule';
import morgan from 'morgan';
import APIKeysResolver from './src/api-keys/resolver';
/* APIKey Schema and Resolvers */
import APIKeySchema from './src/api-keys/typedef.graphql';
import GroupResolver from './src/groups/resolver';
/* Group Schema and Resolvers */
import GroupSchema from './src/groups/typedef.graphql';
// Crons for Data syncing
import UserSyncCron from './src/users/cron';
import UserResolver from './src/users/resolver';
/* User Schema and Resolvers */
import UserSchema from './src/users/typedef.graphql';
import Logger from './src/lib/logger';

/* If environment is test, set-up the environment variables */
if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config();
}

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
/* Configuring Mongoose */
mongoose.plugin((schema: any) => {
  const mongoSchema = schema;
  mongoSchema.options.usePushEach = true;
  return mongoSchema;
});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

/* Establishing mongodb connection */
const dbCredentials = (process.env.DB_USER && process.env.DB_PASSWORD)
  ? `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`
  : '';
const dbConnection = `mongodb://${dbCredentials}${process.env.DB_PATH}/${process.env.DB_NAME}`;
mongoose
  .connect(dbConnection, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .catch(Logger.error);

mongoose.connection.on('error', (error) => {
  Logger.error(error);
});
const schema = mergeSchemas({
  typeDefs: [UserSchema, GroupSchema, APIKeySchema],
  resolvers: [UserResolver, GroupResolver, APIKeysResolver],
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
          `${new Date().toISOString()}- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${
            requestContext.request.operationName
          } }`,
        );
      },
    },
  ],
});

/* Applying apollo middleware to express server */
apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });
});

// Installing the apollo ws subscription handlers
export default app.listen({ port }, () => {
  Logger.info(`🚀 Microservice running on ${process.env.NODE_ENV} at ${port}${apolloServer.graphqlPath}`);
});

/**
 * Create cron jobs
 *
 */
//  Cron for updating the user data which runs daily
schedule.scheduleJob('0 0 * * *', () => {
  Logger.info(`Running User Sync Cron on ${new Date().toISOString()}`);
  UserSyncCron.syncUsers();
});
