/* GraphQL schema definition */

const ApplicationsSchema = /* GraphQL */ `
  type Query {
    apps(filter: ApplicationsFilter, sort: SortInput): [ApplicationDrawerEntry]
    app(appId: String): ApplicationDrawerEntry
  }

  type Mutation {
    addAppDrawerEntry(
      projectId: String!
      appDrawerEntry: NewAppDrawerEntryInput!
    ): ApplicationDrawerEntry
    updateAppDrawerEntry(
      projectId: String!
      appId: String!
      appDrawerEntry: UpdateAppDrawerEntryInput!
    ): ApplicationDrawerEntry
    deleteAppDrawerEntry(
      projectId: String!
      appId: String!
    ): ApplicationDrawerEntry

    setApplicationAuthentication(
      projectId: String!
      appId: ID!
      value: Boolean
    ): ApplicationDrawerEntry
  }

  type ApplicationDrawerEntry {
    _id: ID
    projectId: ID
    appId: ID
    label: String
    authenticate: Boolean
    application: Application
  }

  input ApplicationsFilter {
    appId: String
    name: String
    path: String
    authenticate: Boolean
  }
  input NewAppDrawerEntryInput {
    appId: String
    name: String!
    path: String!
    authenticate: Boolean
    icon: String
  }
  input UpdateAppDrawerEntryInput {
    appId: String
    name: String
    path: String
    authenticate: Boolean
    icon: String
  }
`;

export default ApplicationsSchema;
