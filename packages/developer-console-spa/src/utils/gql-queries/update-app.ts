export const updateApp = /* GraphQL */`
mutation UpdateApp($id: ID!, $app: UpdateAppInput!) {
  updateApp(id: $id, app: $app) {
    id
    name
    appId
    path
    description
  }
}
`;
