export const CreateFeedbackConfig = /* GraphQL */ `
  mutation CreateFeedbackConfig($payload: FeedbackConfigInput!) {
    createFeedbackConfig(payload: $payload) {
      id
      appId
    }
  }
`;
