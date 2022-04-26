type NotificationType = {
  _id?: any;
  contentType: string;
  contentId: string;
  action?: Notification.Action;
  channel: Notification.Channel;
  payload: Notification.Payload;
  scheduled: boolean;
  scheduledFor: Date;
  createdOn: Date;
};

declare namespace Notification {
  type Payload = {
    subject?: string;
    body?: string;
    data?: any;
  };
  declare type Action = 'NEW' | 'UPDATE' | 'DELETE' | 'CUSTOM';
  declare type Channel = 'EMAIL' | 'PUSH';
}
