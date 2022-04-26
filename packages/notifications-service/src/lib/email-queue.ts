import { Job } from 'agenda';
import { pick } from 'lodash';
import { getNotifications, getSubscribers } from '@setup/database';
import { EMAIL_NOTIFICATION_SENDER } from '@setup/env';
import initializeQueue, { agenda } from '@setup/queue';
import { emailTransport } from '@utils/emails';

export const EMAIL_JOB_NAME = 'send email';

type EmailNotificationJob = {
  notification: NotificationType;
  additionalRecipients?: { name: string; email: string }[];
};

export default async function setupEmailJobs() {
  console.log('[EmailQueue] Initializing...');
  /* Define jobs */
  agenda.define(EMAIL_JOB_NAME, async (job: Job) => {
    const { notification, additionalRecipients } = job.attrs
      .data as EmailNotificationJob;

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

    const recipients = subscribers
      .map((subscriber) => `${subscriber.name} <${subscriber.email}>`)
      .join(',');

    if (!Boolean(recipients)) {
      return;
    }

    const copyTo = additionalRecipients?.length
      ? additionalRecipients
          .map((recipient) => `${recipient.name ?? ''} <${recipient.email}>`)
          .join(',')
      : undefined;

    /* Send email using the nodemailer transport */
    await emailTransport.sendMail({
      from: EMAIL_NOTIFICATION_SENDER,
      to: recipients,
      cc: copyTo,
      messageId: notification.contentId ?? record.insertedId.toString(),
      subject: notification.payload.subject,
      text: notification.payload.body,
    });
  });
}

if (require.main === module) {
  setupEmailJobs();
  initializeQueue();
}
