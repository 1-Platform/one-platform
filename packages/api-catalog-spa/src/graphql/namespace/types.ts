import { UserRoverDetails } from 'graphql/users/types';

export type Namespace = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ApiCategory;
  tags: string[];
  owners: ApiOwnerType[];
  appUrl: string;
  hash: string;
  schemaEndpoint: string;
  headers: Header[];
  subscribers: ApiSubscribeType[];
  lastCheckedOn: string;
  createdOn: string;
  createdBy: UserRoverDetails | string;
  updatedOn: string;
  updatedBy: UserRoverDetails | string;
  environments: Environments[];
};

export type Environments = {
  name: string;
  apiBasePath: string;
};

export type ApiSubscribeType = {
  email: string;
  group: ApiEmailGroup;
};

export type OwnerUserType = {
  user: UserRoverDetails;
  group: ApiEmailGroup.USER;
};

export type OwnerMailingType = {
  email: string;
  group: ApiEmailGroup.MAILING_LIST;
};

export type ApiOwnerType = OwnerUserType | OwnerMailingType;

export type Header = {
  key: string;
  value: string;
};

export enum ApiCategory {
  REST = 'REST',
  GRAPHQL = 'GRAPHQL',
}

export enum ApiEmailGroup {
  USER = 'USER',
  MAILING_LIST = 'MAILING_LIST',
}

export type NamespaceStat = {
  all: number;
  graphql: number;
  rest: number;
};
