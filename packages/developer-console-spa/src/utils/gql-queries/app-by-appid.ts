export const appByAppId = /* GraphQL */`
query App($appId: String!) {
  app ( appId: $appId ) {
    id
    name
    path
    description
    ownerId
    isActive
    createdOn
    createdBy
    updatedOn
    updatedBy
  }
}
`;
