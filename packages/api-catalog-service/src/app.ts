/* eslint-disable no-underscore-dangle */
/* eslint-disable no-await-in-loop */
import { ApolloServer, FastifyContext } from 'apollo-server-fastify';
import { ApolloServerPluginDrainHttpServer, ContextFunction } from 'apollo-server-core';
import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import fastify, { FastifyInstance } from 'fastify';
import { IExecutableSchemaDefinition, mergeSchemas } from '@graphql-tools/schema';
import { GraphQLSchema } from 'graphql';
import mongoose from 'mongoose';
import { Logger } from 'pino';

import { Config } from 'config';
import {
  setupUserDataLoader,
  setupSubscriptionStatusLoader,
  setupOutageStatusLoader,
} from 'dataloaders';

import { NamespaceDB } from 'datasources/namespaceDB';
import { SubscriptionDB } from 'datasources/subscriptionDB';
import { SpecStoreDB } from 'datasources/specstoreDB';
import { OutageStatusAPI } from 'datasources/outageStatusAPI';
import { CMDBDataSourceAPI } from 'datasources/cmdbDatasourceAPI';
import { Namespace } from 'db/namespace';
import { Subscription } from 'db/subscription';
import { SpecStore } from 'db/specStore';

import NamespaceResolver from './graph/namespace/resolver';
import NamespaceSchema from './graph/namespace/typedef.graphql';
import { SubscriptionResolvers } from './graph/subscription/resolver';
import SubscriptionSchema from './graph/subscription/typedef.graphql';
import SharedSchema from './graph/typedef.graphql';

export const setupMongoose = async (mongoURI: string, logger: Logger) => {
  /* Setup database connection */
  try {
    await mongoose.connect(mongoURI);
    logger.info('Connected to database');
  } catch (error) {
    logger.error(error, 'Failed to connect to database');
    process.exit(1);
  }
};

export const schema = mergeSchemas({
  typeDefs: [SharedSchema, NamespaceSchema, SubscriptionSchema],
  resolvers: [
    NamespaceResolver,
    SubscriptionResolvers,
  ] as IExecutableSchemaDefinition<IContext>['resolvers'],
});

const fastifyAppClosePlugin = (app: FastifyInstance): ApolloServerPlugin => {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
};

export const startApolloServer = async (gqlSchema: GraphQLSchema, config: Config) => {
  const outageStatusAPI = new OutageStatusAPI(config.outageStatusURL);

  const context: ContextFunction<FastifyContext> = async ({ request }) => {
    const id = request?.headers?.['x-op-user-id'];

    const loaders = {
      user: setupUserDataLoader(config.apiGatewayURL, config.apiGatewayToken),
      subscriptionStatus: setupSubscriptionStatusLoader(),
      outageStatus: setupOutageStatusLoader(outageStatusAPI),
    };

    return { loaders, user: { id } };
  };

  const app = fastify({
    logger: true,
  });

  const server = new ApolloServer({
    schema: gqlSchema,
    context,
    dataSources: () => {
      return {
        namespaceDB: new NamespaceDB(Namespace),
        subscriptionDB: new SubscriptionDB(Subscription),
        specStoreDB: new SpecStoreDB(SpecStore),
        outageStatusAPI,
        cmdbCodeAPI: new CMDBDataSourceAPI(
          config.rhatServiceNowURL,
          config.rhatServieNowUsername,
          config.rhatServieNowPassword,
        ),
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
};
