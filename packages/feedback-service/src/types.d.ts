declare module '*.graphql';
declare module '*.json';

type IFeedback  = {
  description: string;
  experience?: string;
  feedbackType: string;
  ticketID?: string;
  spa: String;
  createdAt: Date;
  createdBy: String;
  modifiedAt: Date;
  modifiedBy: String;
  title?: string;
}
