declare module '*.graphql';declare module '*.json';

export interface IUserTeam {
    name: string;
    access: number;
    primary: Boolean;
  }

  export interface ITimestamp {
    createdAt: Date;
    createdBy: IUser;
    modifiedAt?: string;
    modifiedBy?: IUser;
  }

export interface IUser {
    kerberosID: string;
    name?: string;
    email?: string;
    location?: string;
    title?: string;
    isActive?: Boolean;
    teams?: IUserTeam[];
    timestamp?: ITimestamp;
  }
  
export interface IFeedback {
    description: string;
    experience?: string;
    feedbackType: string;
    iid?: string;
    spa: String;
    portalFeedback: Boolean;
    timestamp: ITimestamp;
    title?: string;
  }
  