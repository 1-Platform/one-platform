export const appPermissionsQuery = /* GraphQL */ `
  query ($appId: String!) {
    app(appId: $appId) {
      appId
      permissions {
        name
        email
        refId
        refType
        role
      }
    }
  }
`;
