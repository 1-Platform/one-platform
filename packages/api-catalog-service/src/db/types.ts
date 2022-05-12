import { Types } from 'mongoose';

export enum IEmailGroup {
  User = 'USER',
  MailingList = 'MAILING_LIST',
}

export enum IApiCategory {
  Rest = 'REST',
  Graphql = 'GRAPHQL',
}

export type IOwnerDoc = {
  mid: string;
  group: IEmailGroup;
};

export type INamespaceDoc = {
  name: string;
  description?: string;
  slug?: string;
  tags: string[];
  owners: IOwnerDoc[];
  schemas: Types.DocumentArray<ISpecSheetDoc>;
  createdBy: string;
  updatedBy: string;
};

export type ISpecSheetDoc = {
  name: string;
  description: string;
  appUrl: string;
  lastCheckedOn: string;
  category: IApiCategory;
  flags: {
    isInternal: boolean;
    isDeprecated: boolean;
  };
  environments: IEnvironment[];
};

export type IEnvironment = {
  id?: Types.ObjectId;
  name: string;
  flags: {
    isPublic: boolean;
  };
  hash?: string;
  slug?: string;
  apiBasePath: string;
  schemaEndpoint: string;
  headers?: IHeaders[];
};

export type IHeaders = {
  key: string;
  value: string;
};

export type ISubscriptionDoc = {
  namespace: Types.ObjectId;
  subscriptions: Array<{
    spec: Types.ObjectId;
    environments: Types.ObjectId[];
  }>;
  subscriber: string;
  subscriberEmail: string;
  createdOn: string;
  updatedOn: string;
};

export type ISpecStoreDoc = {
  namespaceId: Types.ObjectId;
  schemaId: Types.ObjectId;
  environmentId: Types.ObjectId;
  spec: string;
};
