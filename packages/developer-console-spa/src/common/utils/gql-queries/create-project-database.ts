export const createProjectDatabase = /* GraphQL */ `
  mutation ($projectId: ID!, $databaseName: String!, $description: String) {
    createProjectDatabase(
      projectId: $projectId
      databaseName: $databaseName
      description: $description
    ) {
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
