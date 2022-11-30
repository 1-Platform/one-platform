export const updateProjectPermissions = /* GraphQL */`
mutation ($projectId: ID!, $permissions: [ProjectPermissionsInput]) {
  updateProject (projectId: $projectId, app: { permissions: $permissions }) {
    projectId
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
