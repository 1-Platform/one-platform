export const appFeedbackConfig = /* GraphQL */ `
  query FeedbackConfig($appId: String!) {
    getFeedbackConfigByAppId(appId: $appId) {
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
