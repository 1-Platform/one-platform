export type Apps = {
  name: string;
  path: string;
  icon: string;
  isActive: boolean;
  applicationType: "BUILTIN" | "HOSTED";
};

export type ArchivedNotification = {
  id: string;
  subject: string;
  body: string;
  data: string;
  link: string;
  sentOn: string;
  config: {
    source: {
      name: string;
    };
  };
};

export type GetAppList = {
  appsList: Apps[];
  notificationsList: ArchivedNotification[];
};

export type SubscribeNotification = {
  notification: Omit<ArchivedNotification, "config"> & {
    type: "EMAIL" | "PUSH" | "BANNER";
  };
};

export type CreateFeedback = {
  createFeedback: FeedbackReturn;
};

export type CreateFeedbackVariable = {
  input: FeedbackInput;
};

type FeedbackCategory = "BUG" | "FEEDBACK";

export type FeedbackInput = {
  summary: string;
  projectId: string;
  experience?: string;
  error?: string;
  category: FeedbackCategory;
  stackInfo: {
    stack: string;
    path: string;
  };
};

type FeedbackUserType = {
  name: string;
  uid: string;
  rhatUUID: string;
  email: string;
  url: string;
};

export type FeedbackReturn = {
  _id: string;
  summary: string;
  description?: string;
  experience?: string;
  error?: string;
  config: string;
  state: string;
  ticketUrl: string;
  category: FeedbackCategory;
  source: string;
  module: string;
  assignee: string;
  createdOn: string;
  createdBy: FeedbackUserType;
  updatedOn: string;
  updatedBy: FeedbackUserType;
};
