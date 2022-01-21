declare type FeedbackConfig = {
  id: string;
  appId: string;
  isEnabled: boolean;
  sourceType: FeedbackSource;
  sourceApiUrl: string;
  sourceHeaders: FeedbackSourceHeader[];
  projectKey: string;
  feedbackEmail: string;
};

declare enum FeedbackCategory {
  BUG = "BUG",
  FEEDBACK = "FEEDBACK",
}

declare enum FeedbackStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
}

type FeedbackUserProfile = {
  cn: String;
  name: string;
  uid: string;
  rhatUUID: string;
  email: string;
  url: string;
};

declare type FeedbackType = {
  id: string;
  summary: string;
  description: string;
  experience: string;
  error: string;
  config: string;
  state: string;
  source: string;
  ticketUrl: string;
  category: FeedbackCategory;
  module: string;
  stackInfo: StackType;
  assignee: FeedbackUserProfile;
  createdOn: string;
  createdBy: string | FeedbackUserProfile;
  updatedOn: string;
  updatedBy: string | FeedbackUserProfile;
};

type FeedbackSourceHeader = {
  key: string;
  value: string;
};

declare const enum FeedbackSource {
  JIRA = "JIRA",
  GITHUB = "GITHUB",
  GITLAB = "GITLAB",
  EMAIL = "EMAIL",
}
