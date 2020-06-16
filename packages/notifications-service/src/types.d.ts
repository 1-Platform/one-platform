declare module "*.graphql";
declare module "*.json";

declare enum NotificationChannel {
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  BANNER = 'BANNER',
}

declare enum NotificationType {
  TRIGGERED = 'TRIGGERED',
  SCHEDULED = 'SCHEDULED',
}

declare enum NotificationStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

/**
 * Notification API Interface used to send One Platform Notifications
 */
interface OpNotification {
  id?: any;
  subject: string,
  body: string,
  link: string,
  data: any,
  config: string | any,
  secondaryTargets?: string[],
  // QSTN: Put the following fields in options?
  startDate: Date,
  endDate: Date,
  recurring: boolean,

  createdOn: Date,
  createdBy: string,
  updatedOn: Date,
  updatedBy: Date,
}

interface NotificationArchive extends OpNotification {
  status: NotificationStatus;
  receipt: string;
  sentOn: Date;
  messageId: string;
}

type EmailNotificationOptions = {
  subject: string;
  to: string[];
  cc?: string[];
  body: string;
};
type PushNotificationOptions = {
  title: string;
  body: string;
  targets: string[];
  link?: string,
  data?: any;
  type: NotificationChannel.PUSH | NotificationChannel.BANNER;
  sentOn: Date;
};

type NotificationConfig = {
  id?: any,
  template: string,
  defaultLink: string,
  source: string,
  targets: string[],
  channel: NotificationChannel,
  type: string,
  action: string;
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date;
};

type GraphQLArgs = {
  notificationConfig: NotificationConfig,
  id: string,
  [ x: string ]: any,
};

type GraphQLQueryInput = {
  queries: string[],
  variables?: { [ x: string ]: any; },
  fragments?: string[],
};
