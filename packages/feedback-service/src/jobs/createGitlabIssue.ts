import {Worker} from 'bullmq';
import {processIntegrationInput} from '../helpers';
import {WorkerProps} from '.';
import axios from 'axios';
import logger from '../lib/logger';
import { redisConnection } from '../lib/redis';

export const GITLAB_JOB_NAME = 'createGitlabIssue';
export const createGitlabIssue = new Worker<WorkerProps>(
  GITLAB_JOB_NAME,
  async (job) => {
    const {feedbackConfig, userFeedback, app, userData} = job.data;

    const processedFeedback = processIntegrationInput(
      userFeedback,
      app,
      userData
    );
    const params = {
      gitlabIssueInput: {
        title: processedFeedback.summary,
        description: processedFeedback.description,
        projectPath: feedbackConfig.projectKey,
      },
      sourceUrl: feedbackConfig.sourceApiUrl,
    };
    const gitlabResponse = await axios
      .request<any>({
        url: `${params.sourceUrl || process.env.GITLAB_API}`,
        method: 'POST',
        headers: {
          Authorization: `${process.env.GITLAB_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          query: `
      mutation CreateGitlabIssue($input: CreateIssueInput!) {
        createIssue(input: $input) {
          issue {
            title
            webUrl
            state
            description
            author {
              name
              email
              webUrl
            }
          }
        }
      }`,
          variables: {
            input: params.gitlabIssueInput,
          },
        }),
      })
      .then((response) => response.data.data.createIssue.issue)
      .catch((err: Error) => {
        logger.error(err);
        throw new Error('createGitlabIssue operation failed');
      });
    return gitlabResponse;
  },
  {
    connection: redisConnection,
  }
);
