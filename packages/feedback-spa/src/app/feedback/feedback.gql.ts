import gql from 'graphql-tag';
import { FeedbackType } from './feedback.fragment';

export const listFeedback = gql`
query listFeedback {
  listFeedback {
    _id,
    description,
    experience,
    feedbackType,
    ticketID,
    spa,
    createdOn,
    createdBy{
      _id,
      name,
      title,
      uid,
      rhatUUID,
      isActive
    },
    updatedOn,
    updatedBy{
      _id,
      name,
      title,
      uid,
      rhatUUID,
      isActive
    }
    title
  }
}

`;

export const getFeedback = gql`
query getFeedback($id: String!) {
  getFeedback(id: $id) {
    ...feedbackType
  }
}
${FeedbackType}
`;

export const getAllJiraIssues = gql`
query getAllJiraIssues {
  getAllJiraIssues {
    status{
      name
    },
    assignee{
      name
    },
   ticketID
  }
}
`;
