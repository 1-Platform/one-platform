export const updateAppPermissions = /* GraphQL */ `
  mutation ($id: ID!, $permissions: [AppPermissionsInput]) {
    updateApp(id: $id, app: { permissions: $permissions }) {
      id
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
