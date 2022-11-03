export const UpdateFeedbackConfig = /* GraphQL */ `
  mutation UpdateFeedbackConfig($id:ID, $payload: FeedbackConfigInput!) {
    updateFeedbackConfig(id: $id,payload: $payload) {
      id
      appId
    }
  }
`;
