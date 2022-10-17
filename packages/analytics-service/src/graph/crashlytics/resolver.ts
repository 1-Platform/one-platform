import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { ErrUnauthorizedAccess } from 'graph/errors';
import { GraphQLError } from 'graphql';

import {
  CrashlyticOptionInput,
  TDeleteCrashlytics,
  TSetupCrashlytics,
  TUpdateCrashlytics,
} from './types';

const ErrCrashlyticsConfigNotFound = new GraphQLError('Crashlytics config not found', {
  extensions: { code: 'INVALID' },
});
const ErrInvalidExistingProjectOption = new GraphQLError(
  'Kindly provide both projectID and teamID',
  { extensions: { code: 'INVALID' } },
);

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
  Crashlytics: {
    dsn: (parent: { slug: string }, _, { dataSources: { sentryAPI } }) =>
      sentryAPI.getAProjectClientKeys(parent.slug).then((el) => el.body[0].dsn.public),
  },
  Query: {
    async getSentryTeams(_parent, _args, { dataSources: { sentryAPI } }) {
      return sentryAPI.getTeams().then((el) => el.body);
    },
    async getSentryProjects(_parent, args: { teamID: string }, { dataSources: { sentryAPI } }) {
      return sentryAPI.getProjects(args.teamID).then((el) => el.body);
    },
    async getCrashlyticStats(
      _parent,
      args: { appID: string; config: CrashlyticOptionInput },
      { dataSources: { sentryAPI, analyticsConfig } },
    ) {
      const doc = await analyticsConfig.getConfigByAppId(args.appID);
      if (!doc) {
        throw ErrCrashlyticsConfigNotFound;
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
  Mutation: {
    async setupCrashlytics(
      _parent,
      { config }: TSetupCrashlytics,
      { dataSources: { analyticsConfig, sentryAPI }, user },
    ) {
      // check the project has already been configured
      let cfg = await analyticsConfig.getConfigByAppId(config.appID);
      if (cfg && cfg.sentryProjectId) {
        throw ErrCrashlyticsConfigNotFound;
      }

      // provide teamID and projectID if its existing project
      if ((config.projectID && !config.teamID) || (config.teamID && !config.projectID)) {
        throw ErrInvalidExistingProjectOption;
      }
      const isExistingProject = Boolean(config.projectID && config.teamID);

      // create project if not existing
      const projectID = config.projectID ?? `ONEP-001-${config.appID}`;
      let sentryProject;

      try {
        const getSentryProjectRes = await sentryAPI.getAProject(projectID);
        sentryProject = getSentryProjectRes.body;
      } catch {
        if (!isExistingProject) {
          const res = await sentryAPI.createAProject(projectID, config.platform);
          sentryProject = res.body;
        }
      }

      cfg = await analyticsConfig.updateConfigByAppId(config.appID, {
        appId: config.appID,
        sentryProjectId: projectID,
        createdBy: user.id,
        updatedBy: user.id,
      });
      if (!cfg) {
        throw new Error('Failed to setup crashlytics');
      }

      return sentryProject;
    },
    async updateCrashlytics(
      _parent,
      { config, appID }: TUpdateCrashlytics,
      { dataSources: { analyticsConfig, sentryAPI }, user },
    ) {
      // check the project has already been configured
      let cfgDoc = await analyticsConfig.getConfigByAppId(appID);
      if (!cfgDoc || !cfgDoc.sentryProjectId) {
        throw ErrCrashlyticsConfigNotFound;
      }

      // provide teamID and projectID if its existing project
      if ((config.projectID && !config.teamID) || (config.teamID && !config.projectID)) {
        throw ErrInvalidExistingProjectOption;
      }

      if (user.id !== cfgDoc.createdBy) throw ErrUnauthorizedAccess;

      const sentryProject = await sentryAPI.getAProject(config.projectID ?? cfgDoc.sentryProjectId);
      if (config.projectID) {
        const isProjectNotCreated = sentryProject.statusCode !== 201;
        if (isProjectNotCreated) {
          throw new Error('Sentry project not found');
        }
      }

      cfgDoc = await analyticsConfig.updateConfigByAppId(appID, {
        appId: appID,
        sentryProjectId: config?.projectID,
        sentryTeamId: config?.teamID,
      });
      if (!cfgDoc) {
        throw new Error('Failed to setup crashlytics');
      }

      return sentryProject.body;
    },
    async deleteCrashlytics(
      _parent,
      { appID }: TDeleteCrashlytics,
      { dataSources: { analyticsConfig, sentryAPI }, user },
    ) {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.sentryProjectId) {
        throw ErrCrashlyticsConfigNotFound;
      }

      if (user.id !== conf.createdBy) throw ErrUnauthorizedAccess;

      if (conf.sentryProjectId) {
        await analyticsConfig.updateConfigByAppId(appID, { sentryProjectId: '', sentryTeamId: '' });
      } else {
        await analyticsConfig.deleteConfigByAppId(appID);
      }

      const sentryProject = await sentryAPI.getAProject(conf.sentryProjectId);
      return sentryProject.body;
    },
  },
};
