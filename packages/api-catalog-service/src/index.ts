import { Agenda } from 'agenda';
import { setupLogger } from 'logger';
import { setupConfig } from 'config';
import { setupNodeMailer } from 'mailer';
import { setupCronTask } from 'subscriptions';

import { schema, setupMongoose, startApolloServer } from './app';

(async function main() {
  const config = setupConfig();
  const logger = setupLogger();
  const mailer = setupNodeMailer({
    host: config.smtpHost,
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });

  const agenda = new Agenda({ db: { address: config.mongoURI, collection: 'jobs' } });

  try {
    setupCronTask(agenda, logger, { decryptionKey: config.nsEncryptionKey }, mailer);
    logger.info('Subscription Cron started');
  } catch (error) {
    logger.error(error, 'Failed to start subscription cron');
    process.exit(0);
  }
  // await setupAgenda();
  await setupMongoose(config.mongoURI, logger);
  await startApolloServer(schema, config);
})();
