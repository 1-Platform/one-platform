export const appDatabaseConfig = /* GraphQL */`
  query ($projectId: ID!) {
    project(projectId: $projectId) {
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
