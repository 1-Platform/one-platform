import gql from 'graphql-tag';
import { PopulatedFeedbackType, FeedbackType } from './feedback.fragment';

export const listFeedback = gql`
query listFeedback {
  listFeedback {
    ...populatedFeedbackType
  }
}
${PopulatedFeedbackType}
`;

export const getFeedback = gql`
query getFeedback($_id: String!) {
  getFeedback(_id: $_id) {
    ...feedbackType
  }
}
${FeedbackType}
`;