const query = /* GraphQL */`
query NewApp ($projectId: ID!, $app: ApplicationInput!) {
  newApplication(projectId: $projectId, app: $app!) {
    name
    path
    authenticate
    showInAppDrawer
  }
}
`;

export default query;
