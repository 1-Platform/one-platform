import { UserInputError } from 'apollo-server';
import { IResolvers } from '@graphql-tools/utils';
import { EMAIL_JOB_NAME } from '@lib/email-queue';
import { PUSH_JOB_NAME } from '@lib/push-queue';
import { getNotifications } from '@setup/database';
import { agenda } from '@setup/queue';
import NotFoundError from '@utils/NotFoundError';
import prepareList from '@utils/prepareList';
import findNotificationsForUser from '@utils/findNotificationsForUser';

const NotificationResolver: IResolvers<any, IGQLContext> = {
  Query: {
    notifications: async (
      _,
      { filter, since, first = 10, after = 0, sort = { field: 'createdOn', order: -1 } },
      { userId }
    ) => {
      const notifications = await findNotificationsForUser({
        filter: {
          ...filter,
          ...(since && {
            createdOn: {
              $gte: since,
            },
          }),
        },
        userId,
      });

      const edges = notifications
        .sort((prev: NotificationType, next: NotificationType) => {
          const prevField = prev[sort.field as keyof NotificationType];
          const nextField = next[sort.field as keyof NotificationType];
          if (sort.order < 0) {
            return prevField > nextField ? -1 : 1;
          } else {
            return prevField < nextField ? -1 : 1;
          }
        })
        .slice(after, first + after);

      const { totalCount, pageInfo } = prepareList(
        notifications,
        edges,
        first,
        after
      );

      return {
        totalCount,
        edges,
        pageInfo,
      };
    },
    allNotifications: async (
      _,
      {
        filter,
        first = 10,
        after = 0,
        sort = { field: 'createdOn', order: -1 },
      }
    ) => {
      const notificationsCollection = getNotifications().find(filter);

      const edges = await notificationsCollection
        .clone()
        .sort(sort.field, sort.order)
        .skip(after)
        .limit(first)
        .toArray();

      const { totalCount, pageInfo } = prepareList(
        await notificationsCollection.toArray(),
        edges,
        first,
        after
      );

      return {
        totalCount,
        edges,
        pageInfo,
      };
    },
    notification: async (_, { _id }, { userId }) => {
      const notifications = await findNotificationsForUser({
        filter: { _id },
        userId,
      });

      if (notifications.length === 0) {
        throw new NotFoundError('Notification not found.');
      }
      return notifications[0];
    },
  },
  Mutation: {
    publish: async (
      _,
      { event, payload, channel, schedule, additionalRecipients },
      { userId }
    ) => {
      /* TODO: Verify is the user is allowed to publish notifications for the given event */

      const scheduled = Boolean(schedule);
      const scheduledFor = schedule;
      if (schedule <= new Date()) {
        throw new UserInputError(
          'Cannot schedule a notification in the past.',
          {
            argumentName: 'schedule',
          }
        );
      }

      /* create notification */
      const notification = {
        ...event,
        channel,
        payload,
        scheduled,
        scheduledFor,
        createdOn: new Date(),
        createdBy: userId,
      };

      /* Set the appropriate job name */
      const jobName = channel === 'EMAIL' ? EMAIL_JOB_NAME : PUSH_JOB_NAME;
      /* Push the notification to the queue */
      const result = await agenda.schedule(scheduled ? schedule : 'now', jobName, {
        notification,
        additionalRecipients,
      });

      return {
        ok: true,
        _id: result.attrs._id,
      };
    },
  },
};

export default NotificationResolver;
