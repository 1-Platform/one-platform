export const deleteLHSPAConfig = /* GraphQL */`
  mutation ($id: ID!) {
    deleteLHSpaConfig(id: $id) {
      appId
      projectId
    }
  }
`;
