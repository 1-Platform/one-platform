
export class Team {
    _id?: string;
    url: string;
    ticketUrl: string;
    name: string;
    vision?: string;
    description?: string;
    feedback?: Feedback[];
    modules: string[];
    mission?: string;
    parentTeam: string | any;
    mailingList?: string;
    manager?: {
      kerberosID: string;
      name: string;
      email: string;
      roverGroup: string;
    };
    ircChannel: string;
    externalUrl: string;
    ownership: {
      kerberosID?: string;
      name?: string;
      email: string;
      primary?: Boolean;
    };
    timestamp: Timestamp;
  }

export interface Timestamp {
    createdAt: Date;
    createdBy?: {
      kerberosID: string;
      name: string;
      email: string;
    };
    modifiedAt?: Date;
    modifiedBy?: {
      kerberosID: string;
      name: string;
      email: string;
    };
  }
  
  export interface UserTeam {
    name: string;
    access: number;
  }
  
  export class User {
    _id?: string;
    kerberosID: string;
    name: string;
    email: string;
    location?: string;
    title?: string;
    teams?: UserTeam[];
    timestamp?: Timestamp;
    profile?: any;
    preferences?: any;
    services?: any;
    outages?: any;
  }
  
  export interface PopulatedUserTeam {
    name: Team;
    access: number;
    primary: Boolean;
  }
  
  export interface PopulatedUser {
    _id?: string;
    kerberosID: string;
    name: string;
    email: string;
    location?: string;
    title?: string;
    teams?: PopulatedUserTeam[];
    timestamp?: Timestamp;
    profile?: any;
    preferences?: any;
    services?: any;
    outages?: any;
  }
  
  export interface UsersResponse {
    listUsers: User[];
  }
  export interface UserResponse {
    getUser: User;
  }
  
export interface Feedback {
  _id?: string;
  description: string;
  experience?: string;
  feedbackType: string;
  iid?: string;
  module: String;
  portalFeedback: Boolean;
  state?: string;
  assignees?: any;
  timestamp: Timestamp;
  title?: string;
}

export interface FeedbacksResponse {
  listFeedback: Feedback[];
}
export interface FeedbackResponse {
  getFeedback: Feedback;
}
