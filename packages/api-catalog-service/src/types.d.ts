declare module '*.graphql';
declare module '*.json';

/**
 * Types for the API Namespaces
 */
type Maybe<T> = T | null;
type Exact<T extends { [ key: string ]: unknown; }> = { [ K in keyof T ]: T[ K ] };
type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [ SubKey in K ]?: Maybe<T[ SubKey ]> };
type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [ SubKey in K ]: Maybe<T[ SubKey ]> };
/** All built-in and custom scalars, mapped to their actual values */
type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
};

declare enum ApiCategory {
    Rest = 'REST',
    Graphql = 'GRAPHQL'
}

declare enum ApiUserInput {
    User = 'USER',
    MailingList = 'MAILING_LIST'
}

type ApiUserType = {
    __typename?: 'ApiUserType';
    email?: Maybe<Scalars[ 'String' ]>;
    group?: Maybe<ApiUserInput>;
};

type NamespaceUserInput = {
    email: Scalars[ 'String' ];
    group?: Maybe<ApiUserInput>;
};

type HeaderType = {
    __typename?: 'HeaderType';
    key?: Maybe<Scalars[ 'String' ]>;
    value?: Maybe<Scalars[ 'String' ]>;
};

type HeaderInput = {
    key?: Maybe<Scalars[ 'String' ]>;
    value?: Maybe<Scalars[ 'String' ]>;
};

type EnvironmentType = {
    __typename?: 'EnvironmentType';
    name?: Maybe<Scalars[ 'String' ]>;
    hash?: Maybe<Scalars[ 'String' ]>;
    schemaEndpoint?: Maybe<Scalars[ 'String' ]>;
    apiBasePath: Maybe<Scalars[ 'String' ]>;
    headers?: Maybe<Array<Maybe<HeaderType>>>;
};

type EnvironmentInput = {
    name: Scalars[ 'String' ];
    hash?: Scalars[ 'String' ];
    schemaEndpoint: Scalars[ 'String' ];
    apiBasePath: Scalars[ 'String' ];
    headers?: Maybe<Array<Maybe<HeaderInput>>>;
};

type NamespaceType = {
    __typename?: 'NamespaceType';
    name?: Maybe<Scalars[ 'String' ]>;
    slug?: Maybe<Scalars[ 'String' ]>;
    description?: Maybe<Scalars[ 'String' ]>;
    category?: Maybe<ApiCategory>;
    tags?: Maybe<Array<Maybe<Scalars[ 'String' ]>>>;
    owners?: Maybe<Array<Maybe<ApiUserType>>>;
    appUrl?: Maybe<Scalars[ 'String' ]>;
    environments?: Maybe<Array<Maybe<EnvironmentType>>>;
    lastCheckedOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdBy?: Maybe<Scalars[ 'String' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedBy?: Maybe<Scalars[ 'String' ]>;
};

type NamespaceInput = {
    _id?: Maybe<Scalars[ 'ID' ]>;
    name: Scalars[ 'String' ];
    slug: Scalars[ 'String' ];
    description?: Maybe<Scalars[ 'String' ]>;
    hash?: Maybe<Scalars[ 'String' ]>;
    category: ApiCategory;
    tags?: Maybe<Array<Maybe<Scalars[ 'String' ]>>>;
    owners: Array<Maybe<NamespaceUserInput>>;
    appUrl?: Maybe<Scalars[ 'String' ]>;
    environments: Array<Maybe<EnvironmentInput>>;
    lastCheckedOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    createdBy?: Maybe<Scalars[ 'String' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedBy?: Maybe<Scalars[ 'String' ]>;
};

type GetNamespaceByIdArgs = {
    _id: Scalars[ 'String' ];
};

type CreateNamespaceArgs = {
    payload: NamespaceInput;
};

type UpdateNamespaceArgs = {
    _id: Scalars[ 'ID' ];
    payload: NamespaceInput;
};

type DeleteNamespaceArgs = {
    _id: Scalars[ 'String' ];
};

type UserType = {
    cn?: Scalars[ 'String' ];
    mail?: Scalars[ 'String' ];
    uid?: Scalars[ 'String' ];
    rhatUUID?: Scalars[ 'String' ];
};

/**
 * Types for the Namespaces Notification Types
 */
type NsNotificationType = {
    __typename?: 'NSNotificationType';
    namespaceID?: Maybe<Scalars[ 'ID' ]>;
    namespace?: Maybe<NamespaceType>;
    subscribers?: Maybe<Array<Maybe<ApiUserType>>>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
};

type NsNotificationInput = {
    namespaceID: Scalars[ 'ID' ];
    subscribers?: Maybe<Array<Maybe<NamespaceUserInput>>>;
    createdOn?: Maybe<Scalars[ 'DateTime' ]>;
    updatedOn?: Maybe<Scalars[ 'DateTime' ]>;
};

type GetNsNotificationConfigByIdArgs = {
    _id: Scalars[ 'String' ];
};

type CreateNsNotificationConfigArgs = {
    payload: NsNotificationInput;
};

type UpdateNsNotificationConfigArgs = {
    _id: Scalars[ 'ID' ];
    payload: NsNotificationInput;
};

type DeleteNsNotificationConfigArgs = {
    _id: Scalars[ 'String' ];
};

type NsSubscriptionInput = {
    _id?: Maybe<Scalars[ 'String' ]>;
    email?: Maybe<NamespaceUserInput>;
};

type CreateNsSubscriptionArgs = {
    payload?: Maybe<NsSubscriptionInput>;
};
// Universal Query & Mutation Types for the API Catalog
type Query = {
    __typename?: 'Query';
    // API Namespace Query Types
    listNamespaces?: Maybe<Array<Maybe<NamespaceType>>>;
    getNamespaceById?: Maybe<NamespaceType>;
    // NS Notification Query ypes
    listNSNotificationConfigs?: Maybe<Array<Maybe<NsNotificationType>>>;
    getNSNotificationConfig?: Maybe<NsNotificationType>;
};

type Mutation = {
    __typename?: 'Mutation';
    // API Namespace Query Types
    createNamespace?: Maybe<NamespaceType>;
    updateNamespace?: Maybe<NamespaceType>;
    deleteNamespace?: Maybe<NamespaceType>;
    // NS Notification Mutation Types
    createNSNotificationConfig?: Maybe<NsNotificationType>;
    updateNSNotificationConfig?: Maybe<NsNotificationType>;
    deleteNSNotificationConfig?: Maybe<NsNotificationType>;
};
