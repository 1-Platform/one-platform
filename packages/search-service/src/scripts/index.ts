import Agenda, { Job } from 'agenda';
import database from '../setup/database';
import { MONGO_URL } from '../setup/env';
import logger from '../lib/logger';

// eslint-disable-next-line import/no-mutable-exports
export let agenda: Agenda;

export async function startIndexing() {
  /* Start the search indexing job */
  await startIndexing();
}

export default function initializeAgenda() {
  logger.info('SETUP - Agenda for periodic scripts...');

  agenda = new Agenda({ db: { address: MONGO_URL } });

  /* REgister the indexing script */
  agenda.define('indexing script', async (job: Job) => {
    logger.info(`${new Date().toISOString()}- Running ${job.attrs.name}`
      + ` ${job.attrs.data?.scheduled ? 'on schedule' : '(ad-hoc)'}`);
    await startIndexing();
  });

  agenda.on('ready', () => {
    /* Start the agenda scheduler */
    agenda.start();
    /* Schedule the job - every day @ 00:00 AM */
    agenda.every('0 0 * * *', 'indexing cron', { scheduled: true });
  });
}

if (require.main === module) {
  (async () => {
    /* Setup database connection */
    await database();
    /* Setup agenda */
    initializeAgenda();
  })();
}
