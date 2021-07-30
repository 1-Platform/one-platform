export const appFeedbackConfig = /* GraphQL */`
query FeedbackConfig($appId: String!) {
  app(appId: $appId) {
    id
    appId
    feedback {
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
}
`;
