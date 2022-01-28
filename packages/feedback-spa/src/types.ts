// API Types

export type AppsAPI = {
  id: string;
  name: string;
};

export enum FeedbackCategoryAPI {
  BUG = 'BUG',
  FEEDBACK = 'FEEDBACK',
}

export enum FeedbackStatusAPI {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type FeedbackUserProfileAPI = {
  cn: string;
  name: string;
  uid: string;
  rhatUUID: string;
  email: string;
  url: string;
};

export type FeedbackTypeAPI = {
  id: string;
  summary: string;
  description: string;
  experience: string;
  error: string;
  config: string;
  state: string;
  source: string;
  ticketUrl: string;
  category: FeedbackCategoryAPI;
  module: string;
  stackInfo: {
    stack: string;
    path: string;
  };
  assignee: FeedbackUserProfileAPI;
  createdOn: string;
  createdBy: string | FeedbackUserProfileAPI;
  updatedOn: string;
  updatedBy: string | FeedbackUserProfileAPI;
};

export type Pagination<T extends unknown> = {
  count: number;
  data: T;
};
