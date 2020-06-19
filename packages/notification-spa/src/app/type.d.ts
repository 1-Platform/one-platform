declare enum NotificationChannel {
    EMAIL = 'EMAIL',
    PUSH = 'PUSH',
    BANNER = 'BANNER',
}

type NotificationConfig = {
    id?: any,
    template: string,
    defaultLink: string,
    source: string,
    targets: string[],
    channel: NotificationChannel,
    type: string,
    action: string;
    createdBy: string,
    createdOn: Date,
    updatedBy: string,
    updatedOn: Date;
  };
  