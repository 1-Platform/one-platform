import { ApolloServer } from 'apollo-server-express';
import { json } from 'body-parser';
import dotenv from 'dotenv-safe';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser = require('cookie-parser');
import { mergeSchemas } from '@graphql-tools/schema';
import morgan from 'morgan';
import Logger from './src/lib/logger';
import FeedbackResolver from './src/feedbacks/resolver';
import FeedbackSchema from './src/feedbacks/typedef.graphql';
import FeedbackConfigResolver from './src/feedback-config/resolver';
import FeedbackConfigSchema from './src/feedback-config/typedef.graphql';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.test.env' });
} else {
  dotenv.config();
}

/* Setting port for the server */
const port = process.env.PORT || 8080;

const app = express();

app.use(cookieParser());
app.use(json());

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
mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true }).catch(Logger.error);

mongoose.connection.on('error', (error) => {
  Logger.error(error);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

const schema = mergeSchemas({
  typeDefs: [FeedbackConfigSchema, FeedbackSchema],
  resolvers: [FeedbackConfigResolver, FeedbackResolver],
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
      requestDidStart: (requestContext): any => {
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
  Logger.info(`Microservice running on ${process.env.NODE_ENV} at ${port}${apolloServer.graphqlPath}`);
});
