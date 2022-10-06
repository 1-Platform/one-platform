import { CrashlyticsField } from 'graph/crashlytics/types';

export type TSentryTeam = {
  id: string;
  slug: string;
  name: string;
};

export type TSentryProject = {
  id: string;
  slug: string;
  name: string;
  platform: string;
  team: TSentryTeam;
};

export type TSentryProjectStats = {
  start: string;
  end: string;
  intervals: string[];
  groups: [
    {
      by: {
        category: string;
      };
      totals: {
        [key in CrashlyticsField]: number;
      };
      series: {
        [key in CrashlyticsField]: number[];
      };
    },
  ];
};

export type ProjectKey = {
  id: string;
  dsn: {
    public: string;
  };
};

export type ProjectStatOptions = {
  interval?: string;
  start?: string;
  end?: string;
  statsPeriod?: string;
  groupBy: string;
  field: string;
  outcome: string;
};

export type TMatomoRes<T> =
  | ({ result: undefined } & T)
  | {
      result: 'error';
      message: string;
    };

export type TMatamoProject = {
  idsite: number;
  name: string;
  main_url: string;
  ts_created: string;
  ecommerce: number;
  sitesearch: number;
  sitesearch_keyword_parameters: string;
  sitesearch_category_parameters: string;
  timezone: string;
  currency: 'USD' | 'INR';
  exclude_unknown_urls: 0;
  excluded_ips: string;
  excluded_parameters: string;
  excluded_user_agents: string;
  group: string;
  type: 'website' | 'intra_website';
  keep_url_fragment: number;
  creator_login: string;
  timezone_name: string;
  currency_name: string;
};

// dtos
export type CreateWebsiteDTO = {
  appID: string;
  urls?: string[];
  currency: string;
};

export type UpdateWebsiteDTO = Partial<Omit<CreateWebsiteDTO, 'appID'>>;

export type TUserAnalyticsPeriod = 'day' | 'week' | 'month' | 'year' | 'range';

export type TUserAnalyticsDate =
  | 'today'
  | 'yesterday'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastYear'
  | string;

export type TUserVisitorData = {
  reportData: {
    nb_uniq_visitors: number;
    nb_visits: number;
    nb_actions: number;
    max_actions: number;
    nb_actions_per_visit: number;
    avg_time_on_site: string;
    bounce_rate: string;
  };
};

export type TUserVisitorFrequencyData = {
  reportData: {
    nb_uniq_visitors_new: number;
    nb_users_new: number;
    nb_visits_new: number;
    nb_actions_new: number;
    max_actions_new: number;
    bounce_rate_new: string;
    nb_actions_per_visit_new: number;
    avg_time_on_site_new: string;
    nb_uniq_visitors_returning: number;
    nb_users_returning: number;
    nb_visits_returning: number;
    nb_actions_returning: number;
    max_actions_returning: number;
    bounce_rate_returning: string;
    nb_actions_per_visit_returning: number;
    avg_time_on_site_returning: string;
  };
};

export type TUserActionsData = {
  reportData: {
    nb_pageviews: string;
    nb_uniq_pageviews: string;
    nb_downloads: string;
    nb_uniq_downloads: string;
    nb_outlinks: string;
    nb_uniq_outlinks: string;
    nb_searches: string;
    nb_keywords: string;
  };
};

export type TUserGeographyData = {
  reportData: Array<{
    label: string;
    nb_uniq_visitors: number;
    nb_visits: number;
    nb_actions: number;
    revenue: string;
    nb_actions_per_visit: number;
    avg_time_on_site: string;
    bounce_rate: string;
  }>;
};

export type TUserActionByPageURLData = {
  reportData: Array<{
    label: string;
    nb_visits: number;
    nb_hits: number;
    bounce_rate: string;
    avg_time_on_page: string;
    exit_rate: string;
  }>;
};

export type TUserMetricsDTO = {
  period?: TUserAnalyticsPeriod;
  date?: TUserAnalyticsDate;
  filterLimit?: number;
};

export type TUserHistoryDTO = {
  type?: string;
} & Omit<TUserMetricsDTO, 'filterLimit'>;
