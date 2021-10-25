declare module '*.graphql';
declare module '*.json';

/** All built-in and custom scalars, mapped to their actual values */
type UserType = {
  cn?: string;
  mail?: string;
  uid?: string;
  rhatUUID?: string;
};

type Query = {
  listNamespaces?: Array<NamespaceType>;
  getNamespaceById?: NamespaceType;
  fetchAPISchema?: string;
};

type ListNamespacesArgs = {
  limit?: number;
  offset?: number;
};

type GetNamespaceByIdArgs = {
  id: string;
};

type FetchApiSchemaArgs = {
  category?: ApiCategory;
  schemaEndpoint?: string;
  headers: Array<HeaderType>;
};

type NamespaceType = {
  name?: string;
  slug?: string;
  description?: string;
  category?: ApiCategory;
  tags?: Array<string>;
  owners?: Array<ApiUserType>;
  appUrl?: string;
  environments?: Array<NsEnvironmentType>;
  hash?: string;
  schemaEndpoint?: string;
  headers?: Array<HeaderType>;
  subscribers?: Array<ApiUserType>;
  lastCheckedOn?: Date;
  createdOn?: Date;
  createdBy?: string;
  updatedOn?: Date;
  updatedBy?: string;
};

declare enum ApiCategory {
  REST = 'REST',
  GRAPHQL = 'GRAPHQL',
}

type ApiUserType = {
  email?: string;
  group?: ApiEmailGroup;
};

declare enum ApiEmailGroup {
  USER = 'USER',
  MAILING_LIST = 'MAILING_LIST',
}

type NsEnvironmentType = {
  name?: string;
  apiBasePath?: string;
};

type HeaderType = {
  key?: string;
  value?: string;
};

type NsEnvironmentInput = {
  name?: string;
  apiBasePath?: string;
};

type Mutation = {
  createNamespace?: NamespaceType;
  updateNamespace?: NamespaceType;
  deleteNamespace?: NamespaceType;
  addNamespaceSubscriber?: NamespaceType;
  removeNamespaceSubscriber?: NamespaceType;
};

type CreateNamespaceArgs = {
  payload: NamespaceInput;
};

type UpdateNamespaceArgs = {
  id: string;
  payload: NamespaceInput;
};

type DeleteNamespaceArgs = {
  id: string;
};

type AddNamespaceSubscriberArgs = {
  id: string;
  payload: ApiUserInput;
};

type RemoveNamespaceSubscriberArgs = {
  id: string;
  payload: ApiUserInput;
};

type NamespaceInput = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  category: ApiCategory;
  tags?: Array<string>;
  owners: Array<ApiUserInput>;
  appUrl?: string;
  environments: Array<NsEnvironmentInput>;
  schemaEndpoint: string;
  headers?: Array<HeaderInput>;
  subscribers?: Array<ApiUserInput>;
  lastCheckedOn?: Date;
  createdOn?: Date;
  createdBy?: string;
  updatedOn?: Date;
  updatedBy?: string;
};

type ApiUserInput = {
  email: string;
  group?: ApiEmailGroup;
};

type HeaderInput = {
  key?: string;
  value?: string;
};
