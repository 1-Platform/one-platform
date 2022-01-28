import {
  AppsAPI,
  FeedbackCategoryAPI,
  FeedbackStatusAPI,
  FeedbackTypeAPI,
  Pagination,
} from 'types';

export type App = AppsAPI;
export type Feedback = Omit<FeedbackTypeAPI, 'updatedBy' | 'updatedOn'>;

export type GetAppsQuery = {
  apps: App[];
};

export type GetFeedbackListQuery = {
  listFeedbacks: Pagination<Feedback[]>;
};

export type GetFeedbackById = {
  getFeedbackById: Feedback;
};

export type GetFeedbackListQueryVariables = Omit<FeedbackFilters, 'selectedApps'> & {
  appId?: string[] | null;
  limit?: number;
  offset?: number;
};

export type FeedbackFilters = {
  selectedApps: Record<string, App> | null;
  category: FeedbackCategoryAPI | null;
  status: FeedbackStatusAPI | null;
  search: string;
};
