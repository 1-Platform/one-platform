import { IExecutableSchemaDefinition } from '@graphql-tools/schema';

import { CrashlyticOptionInput } from './types';

export const crashlyticsResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  CrashlyticsField: {
    QUANTITY: 'sum(quantity)',
    TIMES_SEEN: 'sum(times_seen)',
  },
  CrashlyticsGroupBy: {
    OUTCOME: 'outcome',
    CATEGORY: 'category',
    REASON: 'reason',
    PROJECT: 'project',
  },
  CrashlyticsOutcome: {
    ACCEPTED: 'accepted',
    FILTERED: 'filtered',
    RATE_LIMITED: 'rate_limited',
    INVALID: 'invalid',
    ABUSE: 'abuse',
    CLIENT_DISCARD: 'client_discard',
  },
  Query: {
    async getSentryTeams(_parent, _args, { dataSources: { sentryAPI } }) {
      return sentryAPI.getTeams().then((el) => el.body);
    },
    async getSentryProjects(_parent, args: { teamId: string }, { dataSources: { sentryAPI } }) {
      return sentryAPI.getProjects(args.teamId).then((el) => el.body);
    },
    async getCrashlyticStats(
      _parent,
      args: { appId: string; config: CrashlyticOptionInput },
      { dataSources: { sentryAPI, analyticsConfig } },
    ) {
      const doc = await analyticsConfig.getConfigByAppId(args.appId);
      if (!doc) {
        throw Error('App is not registered');
      }

      const sentryProjectReq = await sentryAPI.getAProject(doc.sentryProjectId);
      const sentryProject = sentryProjectReq.body;

      const req = await sentryAPI.getProjectStats(sentryProject.id, args.config);
      const stat = req.body;
      return {
        ...stat,
        total: stat.groups?.[0]?.totals[args.config.field],
        series: stat?.groups?.[0]?.series[args.config.field],
      };
    },
  },
};
