import {Worker} from 'bullmq';
import {redisConfiguration} from '../lib/queue';
import {processIntegrationInput, proxyAgent} from '../helpers';
import axios from 'axios';
import {WorkerProps} from '.';
import {Feedback} from '../feedbacks/schema';
import logger from '../lib/logger';

export const JIRA_JOB_NAME = 'createJira';
export const createJira = new Worker<WorkerProps>(
  JIRA_JOB_NAME,
  async (job) => {
    logger.info('processing...');

    const {feedbackConfig, userFeedback, app, userData} = job.data;

    const processedFeedback = processIntegrationInput(
      userFeedback,
      app,
      userData
    );
    const params = {
      jiraIssueInput: {
        fields: {
          project: {
            key: feedbackConfig.projectKey,
          },
          summary: processedFeedback.summary,
          description: processedFeedback.description.replace(
            /(<([^>]+)>)/gi,
            ''
          ),
          labels: ['Reported-via-One-Platform'],
          issuetype: {
            name: 'Task',
          },
        },
      },
      sourceUrl: feedbackConfig.sourceApiUrl || process.env.JIRA_HOST,
    };
    try {
      const jiraResponse = await axios.request<any>({
        url: `${params.sourceUrl || process.env.JIRA_HOST}/rest/api/2/issue/`,
        method: 'POST',
        headers: {
          Authorization: `${process.env.JIRA_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(params.jiraIssueInput),
        ...proxyAgent,
      });

      return Feedback.findOneAndUpdate(userFeedback, {
        ticketUrl: jiraResponse.data.key,
      }).exec();
    } catch (err: any) {
      logger.error(err);
      throw err;
    }
  },
  redisConfiguration
);

createJira.on('active', (job) => {
  logger.info('job started');
});
