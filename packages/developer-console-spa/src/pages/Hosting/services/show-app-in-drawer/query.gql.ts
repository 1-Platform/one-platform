const query = /* GraphQL */`
mutation ShowAppInDrawer ($projectId: String!, $enable: Boolean!) {
  showAppInDrawer(projectId: $projectId, enable: $enable) {
    name
    path
    showInAppDrawer
  }
}
`;

export default query;
