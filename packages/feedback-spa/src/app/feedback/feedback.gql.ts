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
}

`;

export const getFeedback = gql`
query getFeedback($_id: String!) {
  getFeedback(_id: $_id) {
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
