/* GraphQL schema definition */

export default /* GraphQL */`
type Query {
  apps: [App]
  myApps: [App]
  findApps(selectors: FindAppInput!): [App]
  app(appId: String!): App
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
  entityType: AppEntityType
  colorScheme: String
  videoUrl: String
  ownerId: String
  applicationType: AppType
  contacts: AppContacts
  access: [AppAccess]
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
  entityType: AppEntityType
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
  entityType: AppEntityType
  colorScheme: String
  videoUrl: String
  applicationType: AppType
  contacts: AppContactsInput
  access: [AppAccessInput]
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
  entityType: AppEntityType
  colorScheme: String
  videoUrl: String
  ownerId: String
  applicationType: AppType
  contacts: AppContactsInput
  access: [AppAccessInput]
  feedback: AppFeedbackConfigInput
  search: AppMicroserviceConfigInput
  notifications: AppMicroserviceConfigInput
}
enum AppEntityType {
  SPA
  MICROSERVICE
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
type AppAccess {
  roverGroup: String
  role: AppAccessRole
}
input AppAccessInput {
  roverGroup: String
  role: AppAccessRole
}
enum AppAccessRole {
  EDIT
  VIEW
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
