import gql from 'graphql-tag';

export const PopulatedFeedbackType = gql`
fragment populatedFeedbackType on PopulatedFeedbackType {
  _id
  description
  experience
  iid
  module {
    _id
    name
    path
  }
  portalFeedback
  title
  feedbackType
  timestamp {
    createdBy {
      kerberosID
      name
      email
    }
    modifiedAt
    createdAt
    createdBy {
      kerberosID
      name
      email
    }
  }
}
`;

export const FeedbackType = gql`
fragment feedbackType on FeedbackType {
  _id
  description
  experience
  iid
  module
  portalFeedback
  title
  feedbackType
  timestamp {
    createdBy {
      kerberosID
      name
      email
    }
    modifiedAt
    createdAt
    createdBy {
      kerberosID
      name
      email
    }
  }
}
`;
