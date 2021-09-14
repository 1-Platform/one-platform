export const listLHProjectBranches = /* GraphQL */`
 query ListLHProjectBranches($projectID: String!) {
  listLHProjectBranches(projectID: $projectID) {
    branch
  }
}
`;
