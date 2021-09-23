declare module '*.graphql';
declare module '*.json';

type Maybe<T> = T | null;
type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
type MakeOptional<T, K extends keyof T> = Omit<T, K> &
{ [SubKey in K]?: Maybe<T[SubKey]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
{ [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
interface UserType {
    cn?: string;
    mail?: string;
    uid?: string;
    rhatUUID?: string;
}

interface Query {
    listNamespaces?: Maybe<Array<Maybe<NamespaceType>>>;
    getNamespaceById?: Maybe<NamespaceType>;
    fetchAPISchema?: Maybe<string>;
}

interface ListNamespacesArgs {
    limit?: Maybe<number>;
    offset?: Maybe<number>;
}

interface GetNamespaceByIdArgs {
    id: string;
}

interface FetchApiSchemaArgs {
    category?: Maybe<ApiCategory>;
    schemaEndpoint?: string;
    headers: Maybe<Array<Maybe<HeaderType>>>;
}

interface NamespaceType {
    name?: Maybe<string>;
    slug?: Maybe<string>;
    description?: Maybe<string>;
    category?: Maybe<ApiCategory>;
    tags?: Maybe<Array<Maybe<string>>>;
    owners?: Maybe<Array<Maybe<ApiUserType>>>;
    appUrl?: Maybe<string>;
    environments?: Maybe<Array<Maybe<NsEnvironmentType>>>;
    hash?: Maybe<string>;
    schemaEndpoint?: Maybe<string>;
    headers?: Maybe<Array<Maybe<HeaderType>>>;
    subscribers?: Maybe<Array<Maybe<ApiUserType>>>;
    lastCheckedOn?: Maybe<Date>;
    createdOn?: Maybe<Date>;
    createdBy?: Maybe<string>;
    updatedOn?: Maybe<Date>;
    updatedBy?: Maybe<string>;
}

declare enum ApiCategory {
    REST = 'REST',
    GRAPHQL = 'GRAPHQL',
}

interface ApiUserType {
    email?: Maybe<string>;
    group?: Maybe<ApiEmailGroup>;
}

declare enum ApiEmailGroup {
    USER = 'USER',
    MAILING_LIST = 'MAILING_LIST',
}

interface NsEnvironmentType {
    name?: Maybe<string>;
    apiBasePath?: Maybe<string>;
}

interface HeaderType {
    key?: Maybe<string>;
    value?: Maybe<string>;
}

interface NsEnvironmentInput {
    name?: Maybe<string>;
    apiBasePath?: Maybe<string>;
}

interface Mutation {
    createNamespace?: Maybe<NamespaceType>;
    updateNamespace?: Maybe<NamespaceType>;
    deleteNamespace?: Maybe<NamespaceType>;
    addNamespaceSubscriber?: Maybe<NamespaceType>;
    removeNamespaceSubscriber?: Maybe<NamespaceType>;
}

interface CreateNamespaceArgs {
    payload: NamespaceInput;
}

interface UpdateNamespaceArgs {
    id: string;
    payload: NamespaceInput;
}

interface DeleteNamespaceArgs {
    id: string;
}

interface AddNamespaceSubscriberArgs {
    id: string;
    payload: ApiUserInput;
}

interface RemoveNamespaceSubscriberArgs {
    id: string;
    payload: ApiUserInput;
}

interface NamespaceInput {
    id?: Maybe<string>;
    name: string;
    slug?: Maybe<string>;
    description?: Maybe<string>;
    category: ApiCategory;
    tags?: Maybe<Array<Maybe<string>>>;
    owners: Array<Maybe<ApiUserInput>>;
    appUrl?: Maybe<string>;
    environments: Array<Maybe<NsEnvironmentInput>>;
    schemaEndpoint: string;
    headers?: Maybe<Array<Maybe<HeaderInput>>>;
    subscribers?: Maybe<Array<Maybe<ApiUserInput>>>;
    lastCheckedOn?: Maybe<Date>;
    createdOn?: Maybe<Date>;
    createdBy?: Maybe<string>;
    updatedOn?: Maybe<Date>;
    updatedBy?: Maybe<string>;
}

interface ApiUserInput {
    email: string;
    group?: Maybe<ApiEmailGroup>;
}

interface HeaderInput {
    key?: Maybe<string>;
    value?: Maybe<string>;
}
