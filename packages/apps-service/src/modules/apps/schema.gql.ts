/* GraphQL schema definition */

export default /* GraphQL */`
type Query {
  apps: [App]
  myApps: [App]
  findApps(selectors: FindAppInput!): [App]
  app(id: ID, appId: String): App
}
type Mutation {
  createApp(app: CreateAppInput!): App
  updateApp(id: ID!, app: UpdateAppInput!): App
  deleteApp(id: ID!): App
}

type App {
  id: ID
  appId: String
  isActive: Boolean
  name: String
  description: String
  path: String
  icon: String
  colorScheme: String
  videoUrl: String
  ownerId: String
  applicationType: AppType
  contacts: AppContacts
  permissions: [AppPermissions]
  feedback: AppFeedbackConfig
  search: AppMicroserviceConfig
  notifications: AppMicroserviceConfig
  createdBy: String
  createdOn: ISODate
  updatedBy: String
  updatedOn: ISODate
}
input FindAppInput {
  id: ID
  appId: String
  name: String
  path: String
  ownerId: String
  applicationType: AppType
  createdBy: String
  updatedBy: String
}
input CreateAppInput {
  isActive: Boolean
  name: String!
  description: String
  path: String!
  icon: String
  colorScheme: String
  videoUrl: String
  applicationType: AppType
  contacts: AppContactsInput
  permissions: [AppPermissionsInput]
  feedback: AppFeedbackConfigInput
  search: AppMicroserviceConfigInput
  notifications: AppMicroserviceConfigInput
}
input UpdateAppInput {
  isActive: Boolean
  name: String
  description: String
  path: String
  icon: String
  colorScheme: String
  videoUrl: String
  ownerId: String
  applicationType: AppType
  contacts: AppContactsInput
  permissions: [AppPermissionsInput]
  feedback: AppFeedbackConfigInput
  search: AppMicroserviceConfigInput
  notifications: AppMicroserviceConfigInput
}
enum AppType {
  BUILTIN
  HOSTED
}
type AppContacts {
  developers: [String]
  qe: [String]
  stakeholders: [String]
}
input AppContactsInput {
  developers: [String]
  qe: [String]
  stakeholders: [String]
}
type AppPermissions {
  refId: String
  refType: AppPermissionsRefType
  role: String
}
input AppPermissionsInput {
  refId: String!
  refType: AppPermissionsRefType!
  role: String!
}
enum AppPermissionsRefType {
  User
  Group
}
type AppFeedbackConfig {
  isEnabled: Boolean
  sourceType: AppFeedbackSource
  sourceApiUrl: String
  sourceHeaders: [HeaderType]
  projectKey: String
  feedbackEmail: String
}
input AppFeedbackConfigInput {
  isEnabled: Boolean
  sourceType: AppFeedbackSource
  sourceApiUrl: String
  sourceHeaders: [HeaderTypeInput]
  projectKey: String
  feedbackEmail: String
}
enum AppFeedbackSource {
  JIRA
  GITHUB
  GITLAB
  EMAIL
}
type AppMicroserviceConfig {
  isEnabled: Boolean
}
input AppMicroserviceConfigInput {
  isEnabled: Boolean
}
type HeaderType {
  key: String
  value: String
}
input HeaderTypeInput {
  key: String
  value: String
}
`;
