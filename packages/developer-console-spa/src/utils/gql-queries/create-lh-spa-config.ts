export const addLHSpaConfig = /* GraphQL */ `
  mutation createLHSpaConfig($lhSpaConfig: CreateLHSpaConfigInput!) {
    createLHSpaConfig(lhSpaConfig: $lhSpaConfig) {
      _id
      branch
      appId
      projectId
    }
  }
`;
