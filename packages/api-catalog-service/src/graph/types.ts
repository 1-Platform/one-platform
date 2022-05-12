import { IApiCategory, IEmailGroup } from 'db/types';

export type ApiUserType = {
  cn: Maybe<Scalars['String']>;
  uid: Maybe<Scalars['String']>;
  rhatUUID: Maybe<Scalars['String']>;
  rhatJobTitle: Maybe<Scalars['String']>;
  mail: Maybe<Scalars['String']>;
};

export enum ApiCategory {
  REST = 'REST',
  GRAPHQL = 'GRAPHQL',
}

export enum ApiFlags {
  INTERNAL = 'INTERNAL',
  DEPRECATED = 'DEPRECATED',
}

export type ApiHeaderType = {
  key: string;
  value: string;
};

export enum ApiEmailGroup {
  USER = 'USER',
  MAILING_LIST = 'MAILING_LIST',
}

export type OwnerMailingType = {
  email?: Maybe<Scalars['String']>;
  group?: Maybe<ApiEmailGroup>;
};

export type OwnerUserType = {
  user?: Maybe<ApiUserType>;
  group?: Maybe<ApiEmailGroup>;
};

export type ApiOwnerType = OwnerMailingType | OwnerUserType;

export type ApiEnvironmentFlags = {
  isInternal: Scalars['Boolean'];
  isDeprecated: Scalars['Boolean'];
};

export type ApiOwnerInput = {
  mid: Scalars['String'];
  group: IEmailGroup;
};

type HeaderInput = {
  key: string;
  value: string;
};

// Arg to create a namespace
export type CreateNamespaceInputArgs = {
  payload: {
    name: Scalars['String'];
    description?: Scalars['String'];
    owners: ApiOwnerInput[];
    schemas: NsSchemaInput[];
  };
};

export type NsSchemaInput = {
  name: Scalars['String'];
  description: Scalars['String'];
  appUrl: Scalars['String'];
  category: IApiCategory;
  flags: ApiEnvironmentFlags;
  environments: NsEnvironmentInput[];
};

export type NsEnvironmentInput = {
  name: Scalars['String'];
  apiBasePath: Scalars['String'];
  schemaEndpoint: Scalars['String'];
  headers?: Array<HeaderInput>;
  isPublic: Maybe<Scalars['Boolean']>;
};

// Arg to list a namespace
export type ListNamespaceArg = {
  search?: string;
  mid?: string;
  apiCategory?: ApiCategory;
  sort?: 'createdOn' | 'updatedOn' | 'name';
  sortDir?: 1 | -1;
  limit?: number;
  offset?: number;
};

export type GetNamespaceCountArgs = {
  search?: string;
  mid?: string;
};

export type GetNamespaceSubscriberStatusArgs = {
  id: string;
  email: string;
};

export type UpdateNamespaceArgs = {
  id: string;
  payload: Partial<CreateNamespaceInputArgs['payload']>;
};

export type FetchSchemaArgs = {
  envSlug?: string;
  config: { category: ApiCategory; schemaEndpoint: string; headers: ApiHeaderType[] };
};

// Args for subscription resolvers
export type SubcribeSchemaArg = {
  config: { namespaceID: string; schemaID: string; envIDs: string[]; email: string };
};

export type GetSchemaSubscription = {
  namespaceID: string;
  schemaID: string;
};
