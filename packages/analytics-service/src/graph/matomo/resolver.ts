import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { ErrUnauthorizedAccess } from 'graph/errors';
import { GraphQLError } from 'graphql';

import {
  TSetupUserAnalyticsArg,
  TUpdateUserAnalyticsArg,
  TUserAnalyticsHistoryArg,
  TUserAnalyticsVisitorArg,
} from './types';

const ErrUserAnalyticsNotSetup = new GraphQLError('User analytics not configured for the app', {
  extensions: { code: 'INVALID' },
});
const ErrUserConfigPeriodInvalid = new GraphQLError(
  'When period is a range customDate must be provided',
  {
    extensions: { code: 'INVALID' },
  },
);

export const userAnalyticsResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  Query: {
    getUserAnalyticConfigs: async (_parent, _args, { dataSources: { matomoAPI } }) => {
      const sites = await matomoAPI.getAllWebsites();
      return sites.body;
    },
    getUserAnalyticsActionByPageURL: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsVisitorArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserActionByPageURLMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
    getUserAnalyticsActionMetrics: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsVisitorArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserActionMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
    getUserAnalyticsVisitMetrics: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsVisitorArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserVisitMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
        filterLimit: config.limit,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
    getUserAnalyticsVisitFrequencyMetrics: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsVisitorArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserVisitFrequencyMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
        filterLimit: config.limit,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
    getUserAnalyticsVisitGeography: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsHistoryArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserGeographyMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
        type: config.type,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
    getUserAnalyticsVisitDevices: async (
      _parent,
      { appID, config = {} }: TUserAnalyticsHistoryArg,
      { dataSources: { analyticsConfig, matomoAPI } },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (config.period === 'range' && !config.dateRange) {
        throw ErrUserConfigPeriodInvalid;
      }

      const date = config.dateRange ?? config.date;
      const res = await matomoAPI.getUserDeviceMetrics(conf.matomoSiteId, {
        date,
        period: config.period,
        type: config.type,
      });
      if (res.body.result === 'error') {
        throw new Error(res.body.message);
      }

      return res.body.reportData;
    },
  },
  Mutation: {
    setupUserAnalytics: async (
      _parent,
      args: TSetupUserAnalyticsArg,
      { dataSources: { matomoAPI, analyticsConfig }, user },
    ) => {
      const dto = args.config;

      let conf = await analyticsConfig.getConfigByAppId(dto.appID);
      if (conf && conf.matomoSiteId) {
        throw new Error('App has user analytics configured');
      }

      const res = await matomoAPI.createWebsite(dto);
      if (res.result === 'error') {
        throw new Error(res.message);
      }

      const siteDetails = await matomoAPI.getWebsiteBySiteId(String(res.value));
      if (siteDetails.result === 'error') {
        throw new Error(siteDetails.message);
      }

      conf = await analyticsConfig.updateConfigByAppId(dto.appID, {
        appId: dto.appID,
        createdBy: user.id,
        updatedBy: user.id,
        matomoSiteId: String(siteDetails.idsite),
      });

      if (!conf) {
        throw new Error('Failed to setup analytics');
      }

      return siteDetails;
    },
    updateUserAnalytics: async (
      _parent,
      { appID, config }: TUpdateUserAnalyticsArg,
      { dataSources: { matomoAPI, analyticsConfig }, user },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (conf.createdBy !== user.id) throw ErrUnauthorizedAccess;

      const res = await matomoAPI.updateWebsite(conf.matomoSiteId, config);
      if (res.result === 'error') {
        throw new Error(res.message);
      }

      return matomoAPI.getWebsiteBySiteId(conf.matomoSiteId);
    },
    deleteUserAnalytics: async (
      _parent,
      { appID }: { appID: string },
      { dataSources: { analyticsConfig, matomoAPI }, user },
    ) => {
      const conf = await analyticsConfig.getConfigByAppId(appID);
      if (!conf || !conf.matomoSiteId) {
        throw ErrUserAnalyticsNotSetup;
      }

      if (conf.createdBy !== user.id) throw ErrUnauthorizedAccess;

      if (conf.sentryProjectId) {
        await analyticsConfig.updateConfigByAppId(appID, { matomoSiteId: '' });
      } else {
        await analyticsConfig.deleteConfigByAppId(appID);
      }

      const siteDetails = await matomoAPI.getWebsiteBySiteId(conf.matomoSiteId);
      if (siteDetails.result === 'error') {
        throw new Error(siteDetails.message);
      }

      return siteDetails;
    },
  },
  UserAnalyticsDate: {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    LAST_WEEK: 'lastWeek',
    LAST_MONTH: 'lastMonth',
    LAST_YEAR: 'lastYear',
  },
  UserAnalyticsPeriod: {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    RANGE: 'range',
  },
  UserAnalyticsGeographyType: {
    COUNTRY: 'getCountry',
    CONTINENT: 'getContinent',
    REGION: 'getRegion',
    CITY: 'getCity',
  },
  UserAnalyticsDeviceType: {
    TYPE: 'getType',
    BRAND: 'getBrand',
    MODEL: 'getModel',
    OS_FAMILIES: 'getOsFamilies',
    BROWSERS: 'getBrowsers',
  },
  UserAnalyticsActionsMetrics: {
    pageViews: (parent: { nb_pageviews: string }) => parent.nb_pageviews,
    uniquePageViews: (parent: { nb_uniq_pageviews: string }) => parent.nb_uniq_pageviews,
    downloads: (parent: { nb_downloads: string }) => parent.nb_downloads,
    uniqueDownloads: (parent: { nb_uniq_downloads: string }) => parent.nb_uniq_downloads,
    outlinks: (parent: { nb_outlinks: string }) => parent.nb_outlinks,
    uniqueOutlinks: (parent: { nb_uniq_outlinks: string }) => parent.nb_uniq_outlinks,
    searches: (parent: { nb_searches: string }) => parent.nb_searches,
    keywords: (parent: { nb_keywords: string }) => parent.nb_keywords,
  },
  UserAnalyticsVisitHistoryMetrics: {
    uniqueVisitors: (parent: { nb_uniq_visitors: string }) => parent.nb_uniq_visitors,
    visits: (parent: { nb_visits: string }) => parent.nb_visits,
    actions: (parent: { nb_actions: string }) => parent.nb_actions,
    revenue: (parent: { revenue: string }) => parent.revenue,
    actionsPerVisit: (parent: { nb_actions_per_visit: string }) => parent.nb_actions_per_visit,
    avgTimeOnSite: (parent: { avg_time_on_site: string }) => parent.avg_time_on_site,
    bounceRate: (parent: { bounce_rate: string }) => parent.bounce_rate,
  },
  UserAnalyticsVisitFrequencyMetrics: {
    uniqueNewVisitors: (parent: { nb_uniq_visitors_new: string }) => parent.nb_uniq_visitors_new,
    newUsers: (parent: { nb_users_new: string }) => parent.nb_users_new,
    newVisitors: (parent: { nb_visits_new: string }) => parent.nb_visits_new,
    newActions: (parent: { nb_actions_new: string }) => parent.nb_actions_new,
    maxNewActions: (parent: { max_actions_new: string }) => parent.max_actions_new,
    newBounceRate: (parent: { bounce_rate_new: string }) => parent.bounce_rate_new,
    newActionsPerVisit: (parent: { nb_actions_per_visit_new: string }) =>
      parent.nb_actions_per_visit_new,
    newAvgTimeOnSite: (parent: { avg_time_on_site_new: string }) => parent.avg_time_on_site_new,
    uniqueVisitorsReturing: (parent: { nb_uniq_visitors_returning: string }) =>
      parent.nb_uniq_visitors_returning,
    usersReturing: (parent: { nb_users_returning: string }) => parent.nb_users_returning,
    visitsReturing: (parent: { nb_visits_returning: string }) => parent.nb_visits_returning,
    actionsReturing: (parent: { nb_actions_returning: string }) => parent.nb_actions_returning,
    maxActionsReturing: (parent: { max_actions_returning: string }) => parent.max_actions_returning,
    bounceRateReturning: (parent: { bounce_rate_returning: string }) =>
      parent.bounce_rate_returning,
    actionPerVisitReturing: (parent: { nb_actions_per_visit_returning: string }) =>
      parent.nb_actions_per_visit_returning,
    avgSiteTimeOnReturning: (parent: { avg_time_on_site_returning: string }) =>
      parent.avg_time_on_site_returning,
  },
  UserAnalyticsVisitMetrics: {
    uniqueVisitors: (parent: { nb_uniq_visitors: string }) => parent.nb_uniq_visitors,
    visits: (parent: { nb_visits: string }) => parent.nb_visits,
    actions: (parent: { nb_actions: string }) => parent.nb_actions,
    maxActions: (parent: { max_actions: string }) => parent.max_actions,
    actionsPerVisit: (parent: { nb_actions_per_visit: string }) => parent.nb_actions_per_visit,
    avgTimeOnSite: (parent: { avg_time_on_site: string }) => parent.avg_time_on_site,
    bounceRate: (parent: { bounce_rate: string }) => parent.bounce_rate,
  },
  UserAnalyticsActionByPageURLMetrics: {
    visits: (parent: { nb_visits: string }) => parent.nb_visits,
    hits: (parent: { nb_hits: string }) => parent.nb_hits,
    bounceRate: (parent: { bounce_rate: string }) => parent.bounce_rate,
    avgTimeOnPage: (parent: { avg_time_on_page: string }) => parent.avg_time_on_page,
    exitRate: (parent: { exit_rate: string }) => parent.exit_rate,
  },
  UserAnalytics: {
    id: (parent: { idsite: string }) => parent.idsite,
    createdOn: (parent: { ts_created: string }) => parent.ts_created,
    url: (parent: { main_url: string }) => parent.main_url,
  },
};
