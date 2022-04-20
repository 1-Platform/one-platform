import { CrashlyticsField } from 'graph/crashlytics/types';

export type Team = {
  id: string;
  slug: string;
  name: string;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  platform: string;
  team: Team;
};

export type ProjectStats = {
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
