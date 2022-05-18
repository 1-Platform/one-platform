export type UserRoverDetails = {
  cn: string;
  mail: string;
  uid: string;
  rhatUUID: string;
  rhatJobTitle: string;
};

export type Namespace = {
  id: string;
  name: string;
  slug?: string;
  description: string;
  owners: ApiOwnerType[];
  schemas: ApiSchema[];
  createdOn: string;
  createdBy: UserRoverDetails | string;
  updatedOn: string;
  updatedBy: UserRoverDetails | string;
};

export type ApiSchema = {
  id: string;
  name: string;
  description: string;
  lastCheckedOn: string;
  appURL: string;
  docURL: string;
  category: ApiCategory;
  flags: {
    isInternal: boolean;
    isDeprecated: boolean;
  };
  environments: Environments[];
};

export type Environments = {
  id: string;
  name: string;
  apiBasePath: string;
  slug: string;
  schemaEndpoint: string;
  headers: Header[];
  isPublic: boolean;
  isSubscribed: boolean;
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
  total: number;
  graphql: number;
  rest: number;
};

export type Pagination<T extends unknown> = {
  count: number;
  data: T;
};
