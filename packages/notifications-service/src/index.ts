import setupEmailJobs from '@lib/email-queue';
import setupPushJobs from '@lib/push-queue';
import setupDatabaseConnection, { disconnectDatabase } from '@setup/database';
import { DISABLE_EMAIL_NOTIFICATIONS, DISABLE_PUSH_NOTIFICATIONS } from '@setup/env';
import initializeQueue from '@setup/queue';
import { getServer } from './server';

(async () => {
  /* Initialize Database */
  await setupDatabaseConnection();

  /* Setup Email Notification Job */
  if (!DISABLE_EMAIL_NOTIFICATIONS) {
    await setupEmailJobs();
  }
  /* Setup Push Notification Job */
  if (!DISABLE_PUSH_NOTIFICATIONS) {
    await setupPushJobs();
  }
  /* Initialize the queue */
  if (!DISABLE_PUSH_NOTIFICATIONS || !DISABLE_EMAIL_NOTIFICATIONS) {
    await initializeQueue();
  }

  const server = getServer();

  server.listen(8080).then(
    ({ url }) => {
      console.log(`Notifications Service ready at ${url}`);
    },
    async (reason) => {
      console.error(reason);
      await disconnectDatabase();
    }
  );
})();
