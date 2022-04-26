import { getNotifications, getSubscribers } from '@setup/database';
import initializeQueue, { agenda } from '@setup/queue';
import pubsub from '@utils/pubsub';
import { Job } from 'agenda';
import { pick } from 'lodash';

export const PUSH_JOB_NAME = 'send push';

type PushNotificationJob = {
  notification: NotificationType;
};

export default async function setupPushJobs() {
  console.log('[PushQueue] Initializing...');
  /* Define jobs */
  agenda.define(PUSH_JOB_NAME, async (job: Job) => {
    const { notification } = job.attrs.data as PushNotificationJob;
    const record = await getNotifications().insertOne({
      ...notification,
    });
    if (!record.acknowledged) {
      throw new Error('Could not create notification');
    }

    const subscribers = await getSubscribers()
      .find({
        subscriptions: {
          $elemMatch: {
            ...pick(notification, ['contentType', 'contentId', 'action']),
          },
        },
      })
      .toArray();

    /* Push notifications via pubsub */
    subscribers.map((subscriber) => {
      pubsub.publish(subscriber._id, { notificationId: record.insertedId });
    });
  });
}

if (require.main === module) {
  setupPushJobs();
  initializeQueue();
}
