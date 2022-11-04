export const deleteProject = /* GraphQL */`
mutation DeleteProject($projectId: ID!) {
  deleteApp(appId: $projectId) {
    appId
    name
  }
}
`;
