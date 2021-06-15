export const appByAppId = /* GraphQL */`
query App($appId: String) {
  app (selectors: { path: $appId }) {
    id
    name
    path
    description
    owner
    isActive
    createdOn
    createdBy
    updatedOn
    updatedBy
  }
}
`;
