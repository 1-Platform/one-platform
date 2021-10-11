export const createAppDatabase = /* GraphQL */ `
  mutation CreateAppDatabase(
    $id: ID!
    $databaseName: String!
    $description: String
  ) {
    createAppDatabase(
      id: $id
      databaseName: $databaseName
      description: $description
    ) {
      appId
      name
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
