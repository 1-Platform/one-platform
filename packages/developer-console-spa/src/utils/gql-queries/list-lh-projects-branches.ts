export const listLHProjectBranches = /* GraphQL */ `
  query ListLHProjectBranches($projectId: String!) {
    listLHProjectBranches(projectId: $projectId) {
      rows {
        branch
      }
    }
  }
`;
