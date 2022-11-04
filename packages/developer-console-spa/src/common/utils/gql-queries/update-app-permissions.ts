export const updateProjectPermissions = /* GraphQL */`
mutation ($projectId: ID!, $permissions: [AppPermissionsInput]) {
  updateApp (appId: $projectId, app: { permissions: $permissions }) {
    appId
    name
    permissions {
      name
      email
      refId
      refType
      role
    }
  }
}
`;
