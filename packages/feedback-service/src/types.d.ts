declare module '*.graphql';
declare module '*.json';

type IFeedback  = {
  description: string;
  experience?: string;
  feedbackType: string;
  ticketID?: string;
  spa: String;
  createdOn: Date;
  createdBy: String;
  updatedOn: Date;
  updatedBy: String;
  title?: string;
}
