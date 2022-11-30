export const deleteAppDatabase = /* GraphQL */ `
  mutation ($projectId: ID!, $databaseName: String!) {
    deleteProjectDatabase(projectId: $projectId, databaseName: $databaseName) {
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
