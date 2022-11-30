export const manageAppDatabase = /* GraphQL */`
mutation ($projectId: ID!, $databaseName: String!, $description: String, $permissions: AppDatabasePermissionsInput) {
  manageProjectDatabase(projectId: $projectId, databaseName: $databaseName, description: $description, permissions: $permissions) {
    projectId
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
