export const deleteApp = /* GraphQL */`
mutation DeleteApp($id: ID!) {
  deleteApp(id: $id) {
    id
    name
    appId
  }
}
`;
