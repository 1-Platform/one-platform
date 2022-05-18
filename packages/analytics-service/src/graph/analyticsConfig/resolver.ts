import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

import { AnalyticsConfigInput, Pagination } from './types';

export const analyticConfigResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  AnalyticsConfig: {
    id: (parent: { id: string }) => parent.id,
    createdBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    updatedBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    sentryDSN: (parent: { sentryProjectId: string }, _, { dataSources: { sentryAPI } }) =>
      sentryAPI.getAProjectClientKeys(parent.sentryProjectId).then((el) => el.body[0].dsn.public),
  },
  Query: {
    async getAnalyticsConfigByAppId(
      _parent,
      args: { appId: string },
      { dataSources: { analyticsConfig } },
    ) {
      return analyticsConfig.getConfigByAppId(args.appId);
    },
    async getAnalyticsConfigById(
      _parent,
      args: { id: string },
      { dataSources: { analyticsConfig } },
    ) {
      return analyticsConfig.getConfigById(args.id);
    },
    async listAnalyticsConfigs(
      _parent,
      { limit, offset }: Pagination,
      { dataSources: { analyticsConfig } },
    ) {
      return analyticsConfig.listConfig(limit, offset);
    },
  },
  Mutation: {
    async createAnalyticsConfig(
      _parent,
      args: { config: AnalyticsConfigInput },
      { dataSources: { analyticsConfig, sentryAPI }, user },
    ) {
      if (!user?.id) {
        throw Error('Unauthorized Access');
      }

      if (
        args.config.sentryPlatform &&
        !(args.config.sentryProjectId && args.config.sentryTeamId)
      ) {
        const APP_NAME = `op-hosted-${args.config.appId}-spa`;
        await sentryAPI.createAProject(APP_NAME, args.config.sentryPlatform);
      }

      const analyticConfigDoc = await analyticsConfig.createConfig({
        ...args.config,
        createdBy: user.id,
        updatedBy: user.id,
      });

      return analyticConfigDoc;
    },
    async updateAnalyticsConfig(
      _parent,
      args: { id: string; config: AnalyticsConfigInput },
      { dataSources: { analyticsConfig, sentryAPI }, user },
    ) {
      if (!user?.id) {
        throw Error('Unauthorized Access');
      }

      const doc = await analyticsConfig.getConfigById(args.id);
      const isAppIdChanged = Boolean(args.config?.appId) && doc?.appId !== args.config?.appId;

      if (doc?.createdBy !== user?.id) {
        throw Error('Unauthorized Access');
      }

      if (isAppIdChanged) {
        if (!args.config.appId || !args.config.sentryPlatform) {
          throw Error('AppId and Platform must be provided on updating appId');
        }
        await sentryAPI.createAProject(args.config.appId, args.config.sentryPlatform);
      }

      return analyticsConfig.updateConfigById(args.id, {
        ...args.config,
        updatedBy: user.id,
      });
    },
    async deleteAnalyticsConfigById(
      _parent,
      args: { id: string },
      { dataSources: { analyticsConfig }, user },
    ) {
      if (!user?.id) {
        throw Error('Unauthorized Access');
      }

      const doc = await analyticsConfig.getConfigById(args.id);
      if (doc?.createdBy !== user?.id) {
        throw Error('Unauthorized Access');
      }

      return analyticsConfig.deleteConfigById(args.id);
    },
  },
};
