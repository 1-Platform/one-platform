import Agenda from 'agenda';
import { MONGO_URL } from './env';

export const agenda = new Agenda({
  db: { address: MONGO_URL, collection: 'queue' },
});

export default async function initializeQueue() {
  await agenda.start();
}
