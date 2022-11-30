export const listLHProjectBranches = /* GraphQL */`
 query ($projectId: String!) {
  listLHProjectBranches(projectId: $projectId) {
    rows {
      branch
    }
  }
}
`;
