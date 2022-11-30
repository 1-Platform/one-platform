export const updateProject = /* GraphQL */`
mutation ($projectId: ID!, $project: UpdateProjectInput!) {
  updateProject(projectId: $projectId, project: $project) {
    projectId
    name
    description
  }
}
`;
