export const deleteLHSPAConfig = /* GraphQL */`
  mutation DeleteLHSPAConfig($id: ID!) {
    deleteLHSpaConfig(id: $id) {
      appId
      projectId
    }
  }
`;
