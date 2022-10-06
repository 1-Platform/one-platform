import { TUserAnalyticsPeriod } from 'datasource/types';

export type TSetupUserAnalyticsArg = {
  config: {
    appID: string;
    urls: string[];
    currency: string;
  };
};

export type TUpdateUserAnalyticsArg = {
  appID: string;
  config: {
    urls?: string[];
    currency?: string;
  };
};

export type TUserAnalyticsVisitorArg = {
  appID: string;
  config: {
    period?: TUserAnalyticsPeriod;
    date?: string;
    dateRange?: string;
    limit?: number;
  };
};

export type TUserAnalyticsHistoryArg = {
  appID: string;
  config: Partial<{
    period: TUserAnalyticsPeriod;
    date: string;
    dateRange: string;
    type: string;
  }>;
};
