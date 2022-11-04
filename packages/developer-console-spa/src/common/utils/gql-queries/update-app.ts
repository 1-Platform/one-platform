export const updateProject = /* GraphQL */`
mutation UpdateProject($projectId: ID!, $project: UpdateAppInput!) {
  updateApp(appId: $projectId, app: $project) {
    appId
    name
    path
    description
  }
}
`;
