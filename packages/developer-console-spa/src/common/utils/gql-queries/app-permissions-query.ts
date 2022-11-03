export const projectPermissionsQuery = /* GraphQL */ `
  query ($projectId: String!) {
    project: app(appId: $projectId) {
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
