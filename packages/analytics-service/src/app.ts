import { ApolloServer, FastifyContext } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, ContextFunction } from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { IExecutableSchemaDefinition, mergeSchemas } from '@graphql-tools/schema';
import fastify, { FastifyInstance } from 'fastify';
import { GraphQLSchema } from 'graphql';
import { Pool } from 'undici';
import mongoose from 'mongoose';

import { setupConfig } from './config';
import { setupLogger } from './logger';

import analyticConfigSchema from './graph/analyticsConfig/typedef.graphql';
import { analyticConfigResolver } from './graph/analyticsConfig/resolver';

import crashlyticsSchema from './graph/crashlytics/typedef.graphql';
import { crashlyticsResolver } from './graph/crashlytics/resolver';

import userAnalyticsSchema from './graph/matomo/typedef.graphql';
import { userAnalyticsResolver } from './graph/matomo/resolver';

import { AnalyticsConfig } from './datasource/analyticConfigDB';
import { SentryAPI } from './datasource/sentryAPI';
import { MatomoAPI } from './datasource/matomoAPI';
import { setupUserDataLoader } from './dataloader/userLoader';
import { Analytics } from './db/analytics';

const config = setupConfig();
const logger = setupLogger();
const pool = new Pool(config.sentryAPIURL);
const matomoDSPool = new Pool(config.matomoAPIURL);

export const setupMongoose = async () => {
  /* Setup database connection */
  try {
    await mongoose.connect(config.mongoURI);
    logger.info('Connected to database');
  } catch (error) {
    logger.error(error, 'Failed to connect to database');
    process.exit(0);
  }
};

export const graphqlSchema = mergeSchemas({
  typeDefs: [analyticConfigSchema, crashlyticsSchema, userAnalyticsSchema],
  resolvers: [
    analyticConfigResolver,
    crashlyticsResolver,
    userAnalyticsResolver,
  ] as IExecutableSchemaDefinition<IContext>['resolvers'],
});

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

export async function startApolloServer(schema: GraphQLSchema) {
  const context: ContextFunction<FastifyContext> = async ({ request }) => {
    const id = request?.headers?.['x-op-user-id'];
    const loaders = {
      user: setupUserDataLoader(config.apiGatewayURL, config.apiGatewayToken),
    };

    return { loaders, user: { id } };
  };

  const app = fastify({
    logger: true,
  });

  const server = new ApolloServer({
    schema,
    context,
    dataSources: () => {
      return {
        analyticsConfig: new AnalyticsConfig(Analytics),
        sentryAPI: new SentryAPI(
          config.sentryAPIURL,
          config.sentryAPIToken,
          config.sentryOrgName,
          config.sentryTeamName,
          pool,
        ),
        matomoAPI: new MatomoAPI(config.matomoAPIURL, config.matomoAPIToken, matomoDSPool),
      };
    },
    formatError: (error) => ({
      message: error.message,
      locations: error.locations,
      path: error.path,
      ...error.extensions,
    }),
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  });

  await server.start();
  app.register(server.createHandler());
  await app.listen(config.port, '0.0.0.0');
}
