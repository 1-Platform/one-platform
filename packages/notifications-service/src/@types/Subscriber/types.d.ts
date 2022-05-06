type Subscriber = {
  _id: ObjectId;
  username: string;
  name: string;
  email: string;
  subscriptions: Subscriber.Subscription[];
  readNotificationIds?: string[];
};

declare namespace Subscriber {
  type Subscription = {
    _id: ObjectId;
    contentType: string;
    contentId: string;
    enabled?: boolean;
    frequency?: 'IMMEDIATE' | 'DAILY' | 'WEEKLY';
    schedule?: string;
    createdOn: Date;
  };
}
