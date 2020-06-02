declare module "*.graphql";
declare module "*.json";

type ScheduledType = {
  startDate: string;
  time: string;
};

type TriggerBasedType = {
  action: string;
};

// define your types here
type NotificationsConfigType = {
  template: string;
  source: string[] | UserType[];
  channel: string;
  type: string;
  typeOptions: ScheduledType | TriggerBasedType;
  target: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
};

type UserType = {
  name: string;
  title: string;
  uid: string;
  rhatUUID: string;
  isActive?: boolean;
  memberOf: string[];
  apiRole: string;
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
};
