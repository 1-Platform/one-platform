export const manageAppDatabase = /* GraphQL */`
mutation ManageAppDatabase($id: ID!, $databaseName: String!, $description: String, $permissions: AppDatabasePermissionsInput) {
  manageAppDatabase(id: $id, databaseName: $databaseName, description: $description, permissions: $permissions) {
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
