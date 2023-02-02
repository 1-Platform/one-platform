/* GraphQL schema definition */

const ApplicationsSchema = /* GraphQL */ `
  type Query {
    apps(filter: ApplicationsFilter, sort: SortInput): [ApplicationDrawerEntry]
    app(appId: ID!): ApplicationDrawerEntry
  }

  type Mutation {
    addAppDrawerEntry(
      projectId: ID!
      appDrawerEntry: NewAppDrawerEntryInput!
    ): ApplicationDrawerEntry
    updateAppDrawerEntry(
      projectId: ID!
      appId: ID!
      appDrawerEntry: UpdateAppDrawerEntryInput!
    ): ApplicationDrawerEntry
    deleteAppDrawerEntry(projectId: ID!, appId: ID!): ApplicationDrawerEntry

    setApplicationAuthentication(
      projectId: ID!
      appId: ID!
      value: Boolean!
    ): ApplicationDrawerEntry
  }

  type ApplicationDrawerEntry {
    projectId: ID
    appId: ID
    label: String
    path: String
    authenticate: Boolean
    icon: String
    application: Application
    project: Project
    name: String
      @deprecated(
        reason: "This field will be deprecated in the future. Please use 'label' instead."
      )
    applicationType: String
      @deprecated(reason: "This field will be deprecated in the future.")
    isActive: Boolean
      @deprecated(reason: "This field will be deprecated in the future.")
  }

  input ApplicationsFilter {
    appId: ID
    label: String
    path: String
    authenticate: Boolean
  }
  input NewAppDrawerEntryInput {
    appId: ID!
    label: String!
    path: String!
    icon: String
    authenticate: Boolean
  }
  input UpdateAppDrawerEntryInput {
    appId: ID
    label: String
    path: String
    authenticate: Boolean
    icon: String
  }
`;

export default ApplicationsSchema;
