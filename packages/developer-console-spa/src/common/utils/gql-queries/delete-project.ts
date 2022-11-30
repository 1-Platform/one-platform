export const deleteProject = /* GraphQL */`
mutation ($projectId: ID!) {
  deleteProject(projectId: $projectId) {
    projectId
    name
  }
}
`;
