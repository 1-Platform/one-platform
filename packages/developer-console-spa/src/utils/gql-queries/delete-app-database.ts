export const deleteAppDatabase = /* GraphQL */`
mutation DeleteAppDatabase($id: ID!, $databaseName: String!) {
  deleteAppDatabase(id: $id, databaseName: $databaseName) {
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
