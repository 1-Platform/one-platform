export const newApp = /* GraphQL */`
mutation NewApp($app: CreateAppInput!) {
  app:createApp(app: $app) {
    id
    name
    appId
    path
  }
}
`;
