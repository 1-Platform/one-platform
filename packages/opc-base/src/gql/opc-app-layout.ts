import { gql } from "@urql/core";

export const GET_APP_LIST = gql`
  query NavMenu($targets: [String]!) {
    appsList: apps {
      name
      path
      icon
      isActive
      applicationType
    }
    notificationsList: listArchivedNotifications(targets: $targets, limit: 25) {
      id
      subject
      body
      data
      link
      sentOn
      config {
        source {
          name
        }
      }
    }
  }
`;

export const SUBSCRIBE_NOTIFICATION = gql`
  subscription Notifications($targets: [String!]!) {
    notification: newNotifications(target: $targets) {
      id
      subject
      body
      link
      data
      type
      sentOn
    }
  }
`;

export const CREATE_FEEDBACK = gql`
  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      _id
      ticketUrl
    }
  }
`;
