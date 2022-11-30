export const UpdateFeedbackConfig = /* GraphQL */ `
  mutation ($id: ID, $payload: FeedbackConfigInput!) {
    updateFeedbackConfig(id: $id, payload: $payload) {
      id
      projectId
    }
  }
`;
