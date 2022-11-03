const query = /* GraphQL */`
query NewApp ($projectId: String!, $app: ApplicationInput!) {
  newApp(projectId: $projectId, app: $app!) {
    name
    path
    authenticate
    showInAppDrawer
  }
}
`;

export default query;
