const query = /* GraphQL */`
mutation AuthenticateApp ($projectId: String!, $enable: Boolean!) {
  enableAuthentication(projectId: $projectId, enable: $enable) {
    name
    path
    icon
    authenticate
  }
}
`;

export default query;
