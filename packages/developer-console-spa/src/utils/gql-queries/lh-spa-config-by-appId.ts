export const LHSpaConfigByAppId = /* GraphQL */ `
  query GetLHSpaConfigByAppId($appId: String!) {
    getLHSpaConfigByAppId(appId: $appId) {
      _id
      appId
      branch
      projectId
    }
  }
`;
