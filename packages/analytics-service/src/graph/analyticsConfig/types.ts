export type Maybe<T> = T | null;

export type Pagination = {
  limit: number;
  offset: number;
};

export type AnalyticsConfigInput = {
  appId: string;
  sentryTeamId: string;
  sentryProjectId: string;
  sentryPlatform: string;
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
