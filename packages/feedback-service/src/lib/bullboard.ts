import {ExpressAdapter} from '@bull-board/express';
import {jiraQueue, gitlabQueue, githubQueue} from './queue';
import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';

export const serverAdapter = new ExpressAdapter();
createBullBoard({
  queues: [
    new BullMQAdapter(jiraQueue),
    new BullMQAdapter(githubQueue),
    new BullMQAdapter(gitlabQueue),
  ],
  serverAdapter,
});

serverAdapter.setBasePath('/admin');
