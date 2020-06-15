
  export interface User {
    _id: string;
    name: string;
    title: string;
    uid: string;
    rhatUUID: string;
    isActive: boolean;
  }
export interface Feedback {
  _id: string;
  description: string;
  experience: string;
  feedbackType: string;
  ticketID: string;
  spa: string;
  title: string;
  createdOn: Date;
  createdBy: User;
  updatedOn: Date;
  updatedBy: User;
  state?: string;
  assignees?: string;
}


export interface FeedbacksResponse {
  listFeedback: Feedback[];
}
export interface FeedbackResponse {
  getFeedback: Feedback;
}
