declare module '*.graphql';
declare module '*.json';

/**
 * Types for the API Namespaces
 */
type Maybe<T> = T | null;
type Exact<T extends { [ key: string ]: unknown }> = { [ K in keyof T ]: T[ K ] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [ SubKey in K ]?: Maybe<T[ SubKey ]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [ SubKey in K ]: Maybe<T[ SubKey ]> };
/** All built-in and custom scalars, mapped to their actual values */
interface Scalars {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: Date;
}

declare enum ApiCategory {
    REST = 'REST',
    GRAPHQL = 'GRAPHQL'
}

declare enum ApiUserInput {
    USER = 'USER',
    MAILING_LIST = 'MAILING_LIST'
}

interface ApiUserType {
    email?: Maybe<Scalars[ 'String' ]>;
    group?: Maybe<ApiUserInput>;
}

interface NamespaceUserInput {
    email: Scalars[ 'String' ];
    group?: Maybe<ApiUserInput>;
}

interface HeaderType {
    key?: Maybe<Scalars[ 'String' ]>;
    value?: Maybe<Scalars[ 'String' ]>;
}

interface HeaderInput {
    key?: Maybe<Scalars[ 'String' ]>;
    value?: Maybe<Scalars[ 'String' ]>;
}

interface NSEnvironmentType {
    name?: Maybe<Scalars[ 'String' ]>;
    hash?: Maybe<Scalars[ 'String' ]>;
    schemaEndpoint?: Maybe<Scalars[ 'String' ]>;
    apiBasePath: Maybe<Scalars[ 'String' ]>;
    headers?: Maybe<Array<Maybe<HeaderType>>>;
    subscribers?: Maybe<Array<Maybe<ApiUserType>>>;
    lastCheckedOn?: Maybe<Scalars[ 'DateTime' ]>;
}

interface NSEnvironmentInput {
    name: Scalars[ 'String' ];
    hash?: Scalars[ 'String' ];
    schemaEndpoint: Scalars[ 'String' ];
    apiBasePath: Scalars[ 'String' ];
    headers?: Maybe<Array<Maybe<HeaderInput>>>;
    subscribers?: Maybe<Array<Maybe<NamespaceUserInput>>>;
    lastCheckedOn?: Maybe<Scalars[ 'DateTime' ]>;
}

interface NamespaceType {
    name?: Maybe<Scalars[ 'String' ]>;
    slug?: Maybe<Scalars[ 'String' ]>;
    description?: Maybe<Scalars[ 'String' ]>;
    category?: Maybe<ApiCategory>;
    tags?: Maybe<Array<Maybe<Scalars[ 'String' ]>>>;
    owners?: Maybe<Array<Maybe<ApiUserType>>>;
    appUrl?: Maybe<Scalars[ 'String' ]>;
    environments?: Maybe<Array<Maybe<NSEnvironmentType>>>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdBy?: Maybe<Scalars[ 'String' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedBy?: Maybe<Scalars[ 'String' ]>;
}

interface NamespaceInput {
    _id?: Maybe<Scalars[ 'ID' ]>;
    name: Scalars[ 'String' ];
    slug: Scalars[ 'String' ];
    description?: Maybe<Scalars[ 'String' ]>;
    hash?: Maybe<Scalars[ 'String' ]>;
    category: ApiCategory;
    tags?: Maybe<Array<Maybe<Scalars[ 'String' ]>>>;
    owners: Array<Maybe<NamespaceUserInput>>;
    appUrl?: Maybe<Scalars[ 'String' ]>;
    environments: Array<Maybe<NSEnvironmentInput>>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdBy?: Maybe<Scalars[ 'String' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedBy?: Maybe<Scalars[ 'String' ]>;
}

interface ListNamespacesArgs {
    limit?: Maybe<Scalars['Int']>;
    offset?: Maybe<Scalars['Int']>;
}
interface GetNamespaceByIdArgs {
    _id: Scalars[ 'ID' ];
}

interface DeleteNamespaceArgs {
    _id: Scalars[ 'ID' ];
}
interface CreateNamespaceArgs {
    payload: NamespaceInput;
}

interface UpdateNamespaceArgs {
    _id: Scalars[ 'ID' ];
    payload: NamespaceInput;
}

interface AddNamespaceSubscriberArgs {
    _id: Scalars[ 'ID' ];
    envName?: Maybe<Scalars[ 'String' ]>;
    payload: ApiUserInput;
}

interface RemoveNamespaceSubscriberArgs {
    _id: Scalars[ 'ID' ];
    envName?: Maybe<Scalars[ 'String' ]>;
    payload: ApiUserInput;
}

interface FetchAPISchemaArgs {
    category?: Maybe<ApiCategory>;
    environment?: Maybe<NSEnvironmentType>;
}

interface UserType {
    cn?: Scalars[ 'String' ];
    mail?: Scalars[ 'String' ];
    uid?: Scalars[ 'String' ];
    rhatUUID?: Scalars[ 'String' ];
}

// Universal Query & Mutation Types for the API Catalog
interface Query {
    // API Namespace Query Types
    listNamespaces?: Maybe<Array<Maybe<NamespaceType>>>;
    getNamespaceById?: Maybe<NamespaceType>;
    fetchAPISchema?: string;
}

interface Mutation {
    // API Namespace Query Types
    createNamespace?: Maybe<NamespaceType>;
    updateNamespace?: Maybe<NamespaceType>;
    deleteNamespace?: Maybe<NamespaceType>;
    addNamespaceSubscriber?: Maybe<NamespaceType>;
    removeNamespaceSubscriber?: Maybe<NamespaceType>;
}
