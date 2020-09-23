import { gql } from 'apollo-angular';
export const PopulatedFeedbackType = gql`
fragment populatedFeedbackType on PopulatedFeedbackType {
  _id,
  description,
  experience,
  feedbackType,
  ticketID,
  spa,
  timestamp {
    createdBy {
      kerberosID,
      name
    },
    modifiedAt,
    createdAt,
    createdBy {
      kerberosID,
      name
    },
  },
  title
}
`;

export const FeedbackType = gql`
fragment feedbackType on FeedbackType {
  _id
  description
  ticketID
  experience
  spa
  createdOn
  createdBy
  updatedOn
  updatedBy
  title
  feedbackType
}
`;
