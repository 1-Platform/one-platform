export const addLHSpaConfig = /* GraphQL */`
  mutation ($lhSpaConfig: CreateLHSpaConfigInput!) {
    createLHSpaConfig(lhSpaConfig: $lhSpaConfig) {
      _id
      branch
      appId
      projectId
    }
  }
`;
