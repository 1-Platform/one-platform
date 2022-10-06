import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

export const analyticConfigResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  AnalyticsConfig: {
    id: (parent: { id: string }) => parent.id,
    createdBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    updatedBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    crashlytics: async (parent: { sentryProjectId: string }, _, { dataSources }) => {
      const res = await dataSources.sentryAPI.getAProject(parent.sentryProjectId);
      return res.body;
    },
    userAnalytics: async (parent: { matomoSiteId: string }, _, { dataSources }) => {
      const res = await dataSources.matomoAPI.getWebsiteBySiteId(parent.matomoSiteId);
      if (res.result === 'error') {
        return null;
      }
      return res;
    },
  },
  Query: {
    async getAnalyticsConfigByAppId(
      _parent,
      args: { appId: string },
      { dataSources: { analyticsConfig } },
    ) {
      return analyticsConfig.getConfigByAppId(args.appId);
    },
  },
};
