export const projectPermissionsQuery = /* GraphQL */ `
  query ($projectId: ID!) {
    project(projectId: $projectId) {
      projectId
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
