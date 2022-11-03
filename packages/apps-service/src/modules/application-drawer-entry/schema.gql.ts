/* GraphQL schema definition */

const ApplicationsSchema = /* GraphQL */ `
  type Query {
    apps(filter: ApplicationsFilter, sort: SortInput): [ApplicationDrawerEntry]
    app(appId: String): ApplicationDrawerEntry
  }

  type Mutation {
    addAppDrawerEntry(
      projectId: String!
      appDrawerEntry: NewApplicationInput!
    ): ApplicationDrawerEntry
    updateAppDrawerEntry(
      projectId: String!
      appId: String!
      appDrawerEntry: UpdateApplicationInput!
    ): ApplicationDrawerEntry
    deleteAppDrawerEntry(
      projectId: String!
      appId: String!
    ): ApplicationDrawerEntry
  }

  type ApplicationDrawerEntry {
    _id: ID
    projectId: ID
    appId: ID
    label: String
    application: Application
    showInAppDrawer: Boolean
    authenticate: Boolean
  }

  input ApplicationsFilter {
    appId: String
    name: String
    path: String
    showInAppDrawer: Boolean
    authenticate: Boolean
  }
  input NewApplicationInput {
    appId: String
    name: String!
    path: String!
    showInAppDrawer: Boolean
    authenticate: Boolean
    icon: String
    environments: [ApplicationEnvironmentInput!]
  }
  input UpdateApplicationInput {
    appId: String
    name: String
    path: String
    showInAppDrawer: Boolean
    authenticate: Boolean
    icon: String
    environments: [ApplicationEnvironmentInput!]
  }
  input ApplicationEnvironmentInput {
    name: String!
    ref: String
    url: String!
    createdAt: ISODate!
  }
`;

export default ApplicationsSchema;
