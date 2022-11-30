export const projectFeedbackConfig = /* GraphQL */ `
  query ($projectId: String!) {
    getFeedbackConfigByAppId(appId: $projectId) {
      id
      appId
      isEnabled
      sourceType
      sourceApiUrl
      sourceHeaders {
        key
        value
      }
      projectKey
      feedbackEmail
    }
  }
`;
