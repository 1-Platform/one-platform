export const createAppDatabase = /* GraphQL */`
 mutation CreateAppDatabase($id: ID!, $databaseName: String!) {
  createAppDatabase(id: $id, databaseName: $databaseName) {
    appId
    name
    database{
      isEnabled
      databases
    }
  }
}
`;
