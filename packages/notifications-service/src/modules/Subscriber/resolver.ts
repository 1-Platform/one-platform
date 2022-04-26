import { IResolvers } from '@graphql-tools/utils';
import { getSubscribers } from '@setup/database';
import NotFoundError from '@utils/NotFoundError';
import prepareList from '@utils/prepareList';

const SubscriberResolver: IResolvers<any, IGQLContext> = {
  Query: {
    subscriptions: async (
      _,
      {
        filter,
        first = 10,
        after = 0,
        sort = { field: 'createdOn', order: 1 },
      },
      { userId }
    ) => {
      const subscriber = await getSubscribers().findOne({
        ...(filter as Subscriber),
        _id: userId,
      });
      if (!subscriber) {
        throw new NotFoundError('User not found.');
      }
      const { subscriptions } = subscriber;

      const edges = subscriptions
        .sort(
          (prev: Subscriber.Subscription, next: Subscriber.Subscription) => {
            const prevField = prev[sort.field as keyof Subscriber.Subscription];
            const nextField = next[sort.field as keyof Subscriber.Subscription];
            if (sort.order < 0) {
              return prevField > nextField ? -1 : 1;
            } else {
              return prevField < nextField ? -1 : 1;
            }
          }
        )
        .slice(after, first + after);

      const { totalCount, pageInfo } = prepareList(
        subscriptions,
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
  },
  Mutation: {
    subscribe: async (_, { input }, { userId, user }) => {
      /* Check if user exists */
      let subscriber = await getSubscribers().findOne({ _id: userId });
      if (!subscriber) {
        /* If user does not exist, add them to the collection */
        const newUserResult = await getSubscribers().insertOne({
          _id: userId,
          username: user?.username,
          name: user?.name,
          email: user?.email,
          subscriptions: [],
        });

        subscriber = await getSubscribers().findOne({
          _id: newUserResult.insertedId,
        });
        if (!subscriber || !newUserResult.acknowledged) {
          throw new NotFoundError('Subscriber not found.');
        }
      }

      /* Check if the user has already susbcribed to the subscription */
      const susbcriptionIndex = subscriber.subscriptions.findIndex(
        (subscription) =>
          subscription.contentType === input.contentType &&
          ('contentId' in input
            ? subscription.contentId === input.contentId
            : true)
      );
      if (susbcriptionIndex === -1) {
        /* If not, add the subscription */
        subscriber.subscriptions.push({
          enabled: true,
          frequency: 'IMMEDIATE',
          ...input,
          createdOn: new Date(),
          updatedOn: new Date(),
        });
      } else {
        /* Or just update the existing subscription */
        subscriber.subscriptions[susbcriptionIndex] = {
          ...input,
          updatedOn: new Date(),
        };
      }

      /* Send update command */
      const result = await getSubscribers().updateOne(
        { _id: subscriber._id },
        {
          $set: {
            subscriptions: subscriber.subscriptions,
            createdOn: new Date(),
            updatedOn: new Date(),
          },
        }
      );

      if (!result.acknowledged) {
        throw new Error('There was some error');
      }

      return {
        ok: true,
        _id: subscriber._id,
      };
    },
    unsubscribe: async (_, { subscriptionId }, { userId }) => {
      const subscriber = await getSubscribers().findOne({ _id: userId });
      if (!subscriber) {
        throw new NotFoundError('Subscriber not found.');
      }

      /* Remove the susbcription from the subscriptions array */
      subscriber.subscriptions = subscriber.subscriptions.filter(
        (subscription) => subscription._id !== subscriptionId
      );
      /* Send update command */
      const result = await getSubscribers().updateOne(
        { _id: subscriber._id },
        {
          $set: { subscriptions: subscriber.subscriptions },
        }
      );

      return {
        ok: result.acknowledged,
        _id: subscriber._id,
      };
    },
    readNotification: async (_, { notificationId }, { userId, user }) => {
      try {
        let subscriber = await getSubscribers().findOne({ _id: userId });

        if (!subscriber) {
          await getSubscribers().insertOne({
            _id: userId,
            username: user.username,
            name: user.name,
            email: user.email,
            subscriptions: [],
          });

          subscriber = await getSubscribers().findOne({ _id: userId });

          if (!subscriber) {
            throw new Error(
              'There was some error getting the user information'
            );
          }
        }

        if (subscriber.readNotificationIds?.includes(notificationId)) {
          return {
            ok: true,
            _id: userId,
          };
        }
        if (!Array.isArray(subscriber?.readNotificationIds)) {
          subscriber.readNotificationIds = [];
        }
        subscriber.readNotificationIds.unshift(notificationId);
        const result = await getSubscribers().updateOne(
          { _id: subscriber._id },
          { $set: { readNotificationIds: subscriber.readNotificationIds } }
        );

        return {
          ok: result.acknowledged,
          _id: userId,
        };
      } catch (error: any) {
        return {
          ok: false,
          errorMessage: error.message,
          error,
        };
      }
    },
  },
  Notification: {
    isRead: async (parent, _, { userId }) => {
      const user = await getSubscribers().findOne({
        _id: userId,
        readNotificationIds: parent._id,
      });
      return Boolean(user);
    },
  },
};

export default SubscriberResolver;
