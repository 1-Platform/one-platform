import { getNotifications, getSubscribers } from '@setup/database';
import NotFoundError from '@utils/NotFoundError';
import { pick } from 'lodash';

type FindNotificationsForUserProps = {
  filter?: Partial<NotificationType>;
  userId: string;
};

export default async function findNotificationsForUser({
  filter,
  userId,
}: FindNotificationsForUserProps) {
  const subscriber = await getSubscribers().findOne({ _id: userId });
  if (!subscriber) {
    throw new NotFoundError('User not found');
  }

  /* Find all notifications with matching filter, contentType, contentId and action */
  const notifications = await getNotifications()
    .find({
      ...filter,
      $or: subscriber.subscriptions.map((subscription) => {
        return {
          ...pick(subscription, ['contentType', 'contentId', 'action']),
          createdOn: { $gte: subscription.createdOn },
        };
      }),
    })
    .toArray();

  return notifications;
}
