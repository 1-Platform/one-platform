declare module '*.graphql';
declare module '*.json';

type IUser  = {
  kerberosID: string;
  name: string;
}

type ITimestamp = {
  createdAt: Date;
  createdBy: IUser;
  modifiedAt?: string;
  modifiedBy?: IUser;
}
  
type IFeedback  = {
  description: string;
  experience?: string;
  feedbackType: string;
  ticketID?: string;
  spa: String;
  timestamp: ITimestamp;
  title?: string;
}
