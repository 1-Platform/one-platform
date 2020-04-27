import gql from 'graphql-tag';

export const listNotificationItems = gql`
query listNotificationItems {
    notificationItems {
        name,
        title
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