declare module '*.graphql';
declare module '*.json';

/** All built-in and custom scalars, mapped to their actual values */
type ApiUserType = {
  cn?: string;
  mail?: string;
  uid?: string;
  rhatUUID?: string;
  rhatJobTitle?: string;
};

type Pagination<T extends unknown> = {
  count: number;
  data: T;
};

type Query = {
  listNamespaces?: Array<NamespaceType>;
  getNamespaceById?: NamespaceType;
  fetchAPISchema?: string;
};

type ListNamespacesArgs = {
  limit?: number;
  offset?: number;
  search?: string;
  sort?: 'createdOn' | 'updatedOn';
  mid?: string;
  apiCategory?:ApiCategory
};

type GetNamespaceByIdArgs = {
  id: string;
};

type GetNamespaceCountArgs = {
  search?: string;
  mid?: string;
};

type GetNamespaceSubscriberStatusArgs = {
  id: string;
  email: string;
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
  owners?: Array<ApiOwnerType>;
  appUrl?: string;
  environments?: Array<NsEnvironmentType>;
  hash?: string;
  schemaEndpoint?: string;
  headers?: Array<HeaderType>;
  subscribers?: Array<ApiSubscribeType>;
  lastCheckedOn?: Date;
  createdOn?: Date;
  createdBy?: ApiUserType | string;
  updatedOn?: Date;
  updatedBy?: ApiUserType | string;
};

type NamespaceDoc = Omit<NamespaceType, 'owners'> & { owners: Array<ApiOwnerInput> };

declare enum ApiCategory {
  REST = 'REST',
  GRAPHQL = 'GRAPHQL',
}

type ApiSubscribeType = {
  email?: string;
  group?: ApiEmailGroup;
};

type OwnerUserType = {
  user: ApiUserType;
  group: ApiEmailGroup.USER;
};

type OwnerMailingType = {
  email: string;
  group: ApiEmailGroup.MAILING_LIST;
};

type ApiOwnerType = OwnerUserType | OwnerMailingType;

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
  payload: ApiSubscriberInput;
};

type RemoveNamespaceSubscriberArgs = {
  id: string;
  payload: ApiSubscriberInput;
};

type NamespaceInput = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  category: ApiCategory;
  tags?: Array<string>;
  owners: Array<ApiOwnerInput>;
  appUrl?: string;
  environments: Array<NsEnvironmentInput>;
  schemaEndpoint: string;
  headers?: Array<HeaderInput>;
  subscribers?: Array<ApiSubscriberInput>;
  lastCheckedOn?: Date;
  createdOn?: Date;
  createdBy?: string;
  updatedOn?: Date;
  updatedBy?: string;
};

type ApiSubscriberInput = {
  email: string;
  group?: ApiEmailGroup;
};

type ApiOwnerInput = {
  mid: string;
  group?: ApiEmailGroup;
};

type HeaderInput = {
  key?: string;
  value?: string;
};
