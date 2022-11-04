export const createAppDatabase = /* GraphQL */`
 mutation CreateAppDatabase($id: ID!, $databaseName: String!, $description: String) {
  createAppDatabase(id: $id, databaseName: $databaseName, description: $description) {
    id
    name
    appId
    path
    description
    ownerId
    isActive
    createdOn
    createdBy
    updatedOn
    updatedBy
    database {
      isEnabled
      databases {
        name
        description
        permissions {
          admins
          users
        }
      }
    }
  }
}
`;
