declare module "*.graphql";
declare module "*.json";

type ScheduledType = {
  startDate: string,
  time: string;
};

type TriggerBasedType = {
  action: string;
};

type NotificationConfigType = {
  id?: any,
  template: string,
  source: string,
  channel: string,
  type: string,
  typeOptions: ScheduledType | TriggerBasedType;
  target: string,
  createdBy: string,
  createdOn: Date,
  updatedBy: string,
  updatedOn: Date;
};

type GraphQLArgs = {
  notificationConfig: NotificationConfigType,
  id: string,
  [ x: string ]: any,
};

type GraphQLQueryInput = {
  queries: string[],
  variables?: { [ x: string ]: any; },
  fragments?: string[],
};
