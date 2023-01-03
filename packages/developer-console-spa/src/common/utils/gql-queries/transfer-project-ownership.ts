export const transferProjectOwnership = /* GraphQL */ `
  mutation ($projectId: ID!, $userId: String!) {
    project: transferProjectOwnership(projectId: $projectId, ownerId: $userId) {
      projectId
      ownerId
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
