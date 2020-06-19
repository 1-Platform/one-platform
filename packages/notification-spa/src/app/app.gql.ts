import gql from 'graphql-tag';

const notificationConfigFragment = gql`
fragment notification on NotificationConfigRaw {
  id
  configID
  template
  defaultLink
  channel
  type
  action
  targets
  source {
    _id
    name
    icon
    active
    owners {
      _id
      name
    }
  }
  createdBy
  createdOn
  updatedBy
  updatedOn
}
`;

export const getNotificationConfigBy = gql`
query GetNotificationConfigsBy ($input: NotificationConfigInput!) {
  getNotificationConfigsBy(selectors: $input) {
    id
    configID
    template
    defaultLink
    channel
    type
    action
    targets
    source {
      _id
      name
    }
    createdBy
    createdOn
    updatedBy
    updatedOn
  }
}
`;

export const deleteNotificationConfig = gql`
${notificationConfigFragment}
mutation DeleteNotificationConfig ($id: String!) {
  deleteNotificationConfig(id: $id) {
    ...notification
  }
}`;

export const createNotificationConfig = gql`
${notificationConfigFragment}
mutation CreateNotificationConfig($input: NotificationConfigInput!) {
  createNotificationConfig(notificationConfig: $input) {
    ...notification
  }
}
`;

export const updateNotificationConfig = gql`
${notificationConfigFragment}
mutation UpdateNotificationConfig($input: NotificationConfigInput!) {
  updateNotificationConfig(notificationConfig: $input) {
    ...notification
  }
}
`;

const homeFragment = gql`
fragment home on HomeType {
  _id
  name
}
`;

export const getHomeTypeByUser = gql`
${homeFragment}
query GetHomeTypeByUser ($rhuuid: String!) {
  getHomeTypeByUser(rhuuid: $rhuuid) {
    ...home
  }
}
`;
