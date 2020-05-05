import gql from 'graphql-tag';

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
  feedbackType
  ticketID
  experience
  spa
  timestamp {
    createdBy {
      kerberosID
      name
    }
    modifiedAt
    createdAt
    createdBy {
      kerberosID
      name
    }
  }
  title
}
`;
