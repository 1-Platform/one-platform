export const LHSpaConfigByAppId = /* GraphQL */`
  query ($projectId: String!) {
    getLHSpaConfigByAppId(appId: $projectId) {
      _id
      appId
      branch
      projectId
    }
}`;
