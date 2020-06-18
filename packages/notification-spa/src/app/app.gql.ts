import gql from 'graphql-tag';

export const getNotificationConfigBy = gql`
query GetNotificationConfigsBy ($input: NotificationConfigInput!) {
  getNotificationConfigsBy(notificationConfig: $input) {
    channel
    configID
    createdBy
    createdOn
    targets
    type
    source {
      _id
      icon
      link
      active
      entityType
    }
  }
}
`;

export const manualNotification = gql`
mutation manualNotificaion (
    $input: manualNotification
    ) {
        manualNotification (
            input: $input
        ) {
            name,
            channel,
            trigger,
            infomation,
        }
    }
`;

export const notificationFormData = gql`
mutation notificationFormData (
    $input: notificationFormData
    ) {
        notificationFormData (
            input: $input
        ) {
            _id,
            name,
            channel,
            trigger,
            infomation,
        }
    }
`;