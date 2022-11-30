export const CreateFeedbackConfig = /* GraphQL */ `
  mutation ($payload: FeedbackConfigInput!) {
    createFeedbackConfig(payload: $payload) {
      id
      projectId
    }
  }
`;
