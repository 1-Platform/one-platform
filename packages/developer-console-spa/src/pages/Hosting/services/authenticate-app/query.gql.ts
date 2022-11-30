const query = /* GraphQL */`
mutation AuthenticateApp ($projectId: ID!, $enable: Boolean!) {
  enableAuthentication(projectId: $projectId, enable: $enable) {
    name
    path
    icon
    authenticate
  }
}
`;

export default query;
