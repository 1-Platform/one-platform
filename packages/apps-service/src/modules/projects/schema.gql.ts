/* GraphQL schema definition */

const ProjectsSchema = /* GraphQL */ `
  type Query {
    projects: [Project]
    myProjects: [Project]
    findProjects(selectors: FindProjectInput!): [Project]
    project(projectId: ID!): Project
  }
  type Mutation {
    createProject(project: CreateProjectInput!): Project
    updateProject(projectId: ID!, project: UpdateProjectInput!): Project
    deleteProject(projectId: ID!): Project
    transferProjectOwnership(projectId: ID!, ownerId: String!): Project

    newApplication(
      projectId: ID!
      application: NewApplicationInput!
    ): Application
    updateApplication(
      projectId: ID!
      appId: ID!
      application: UpdateApplicationInput!
    ): Application
    deleteApplication(projectId: ID!, appId: ID!): Application

    createProjectDatabase(
      projectId: ID!
      databaseName: String!
      description: String
      permissions: ProjectDatabasePermissionsInput
    ): Project
    deleteProjectDatabase(projectId: ID!, databaseName: String!): Project
    manageProjectDatabase(
      projectId: ID!
      databaseName: String!
      description: String
      permissions: ProjectDatabasePermissionsInput
    ): Project
  }

  type Project {
    projectId: ID
    name: String
    description: String
    icon: String
    ownerId: String
    contacts: ProjectContacts
    permissions: [ProjectPermissions]
    hosting: ProjectHostingConfig
    feedback: ProjectFeedbackConfig
    search: ProjectMicroserviceConfig
    notifications: ProjectMicroserviceConfig
    database: ProjectDatabaseConfig
    createdBy: String
    createdOn: ISODate
    updatedBy: String
    updatedOn: ISODate
  }
  input FindProjectInput {
    projectId: ID
    name: String
    ownerId: String
    createdBy: String
    updatedBy: String
  }
  input CreateProjectInput {
    name: String!
    description: String
    icon: String
    colorScheme: String
    videoUrl: String
    contacts: ProjectContactsInput
    permissions: [ProjectPermissionsInput]
  }
  input UpdateProjectInput {
    name: String
    description: String
    icon: String
    ownerId: String
    contacts: ProjectContactsInput
    permissions: [ProjectPermissionsInput]
    feedback: ProjectFeedbackConfigInput
    search: ProjectMicroserviceConfigInput
    notifications: ProjectMicroserviceConfigInput
  }
  type ProjectContacts {
    developers: [String]
    qe: [String]
    stakeholders: [String]
  }
  input ProjectContactsInput {
    developers: [String]
    qe: [String]
    stakeholders: [String]
  }
  type ProjectPermissions {
    name: String
    email: String
    refId: String
    refType: ProjectPermissionsRefType
    role: String
    customRoles: [String]
  }
  input ProjectPermissionsInput {
    name: String!
    email: String
    refId: String!
    refType: ProjectPermissionsRefType!
    role: String!
    customRoles: [String]
  }
  enum ProjectPermissionsRefType {
    User
    Group
  }
  type ProjectHostingConfig {
    isEnabled: Boolean
    applications: [Application]
  }
  type Application {
    appId: ID
    name: String
    url: String
    environments: ApplicationEnvironment
    createdOn: ISODate
  }
  type ApplicationEnvironment {
    name: String
    version: String
    url: String
    createdAt: ISODate
  }

  input NewApplicationInput {
    appId: String!
    name: String!
    url: String!
    type: String
    environments: [ApplicationEnvironmentInput]
  }
  input ApplicationEnvironmentInput {
    name: String!
    version: String!
    url: String!
    createdAt: ISODate
  }
  input UpdateApplicationInput {
    appId: String
    name: String
    url: String
    type: String
    environments: [ApplicationEnvironmentInput]
  }

  type ProjectFeedbackConfig {
    isEnabled: Boolean
    sourceType: ProjectFeedbackSource
    sourceApiUrl: String
    sourceHeaders: [HeaderType]
    projectKey: String
    feedbackEmail: String
  }
  input ProjectFeedbackConfigInput {
    isEnabled: Boolean
    sourceType: ProjectFeedbackSource
    sourceApiUrl: String
    sourceHeaders: [HeaderTypeInput]
    projectKey: String
    feedbackEmail: String
  }
  enum ProjectFeedbackSource {
    JIRA
    GITHUB
    GITLAB
    EMAIL
  }
  type ProjectMicroserviceConfig {
    isEnabled: Boolean
  }
  input ProjectMicroserviceConfigInput {
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

  type ProjectDatabaseConfig {
    isEnabled: Boolean
    databases: [ProjectDatabaseDetails]
  }
  type ProjectDatabaseDetails {
    name: String
    description: String
    permissions: ProjectDatabasePermissions
  }
  type ProjectDatabasePermissions {
    admins: [String]
    users: [String]
  }
  input ProjectDatabasePermissionsInput {
    admins: [String!]
    users: [String!]
  }
`;

export { ProjectsSchema as default };
