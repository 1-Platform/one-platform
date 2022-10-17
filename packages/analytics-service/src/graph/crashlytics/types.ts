import { Maybe } from '../types';

export type Pagination = {
  limit: number;
  offset: number;
};

export enum CrashlyticsGroupBy {
  Outcome = 'outcome',
  Category = 'category',
  Reason = 'reason',
  Project = 'project',
}

export enum CrashlyticsField {
  Quantity = 'sum(quantity)',
  TimesSeen = 'sum(times_seen)',
}

export enum CrashlyticsOutcome {
  Accepted = 'accepted',
  Filtered = 'filtered',
  RateLimited = 'rate_limited',
  Invalid = 'invalid',
  Abuse = 'abuse',
  ClientDiscard = 'client_discard',
}

export type CrashlyticOptionInput = {
  interval?: Maybe<String>;
  start?: Maybe<String>;
  end?: Maybe<String>;
  statsPeriod?: Maybe<String>;
  groupBy: CrashlyticsGroupBy;
  field: CrashlyticsField;
  outcome?: Maybe<CrashlyticsOutcome>;
};

export type TSetupCrashlytics = {
  config: {
    appID: string;
    projectID?: string;
    teamID?: string;
    platform: string;
  };
};

export type TUpdateCrashlytics = {
  appID: string;
  config: {
    platform: string;
    projectID: string;
    teamID: string;
  };
};

export type TDeleteCrashlytics = {
  appID: string;
};
