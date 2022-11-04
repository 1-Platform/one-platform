export const appDatabaseConfig = /* GraphQL */`
  query ($appId: String!) {
    app(appId: $appId) {
      appId
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
