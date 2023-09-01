import {Worker} from 'bullmq';
import {WorkerProps} from '.';
import {processIntegrationInput} from '../helpers';
import axios from 'axios';
import logger from '../lib/logger';
import { redisConnection } from '../lib/redis';

export const GITHUB_JOB_NAME = 'createGithubIssue';
export const createGithubIssue = new Worker<WorkerProps>(
  GITHUB_JOB_NAME,
  async (job) => {
    const {feedbackConfig, userFeedback, app, userData} = job.data;

    const processedFeedback = processIntegrationInput(
      userFeedback,
      app,
      userData
    );
    const params = {
      githubIssueInput: {
        title: processedFeedback.summary,
        body: processedFeedback.description,
        repositoryId: feedbackConfig.projectKey,
      },
      sourceUrl: feedbackConfig.sourceApiUrl,
    };
    const githubResponse = await axios
      .request<any>({
        url: `${params.sourceUrl || process.env.GITHUB_API}`,
        method: 'POST',
        headers: {
          Authorization: `${process.env.GITHUB_AUTH_TOKEN}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          query: `mutation CreateGithubIssue($input: CreateIssueInput!) {
                      createIssue(input: $input) {
                          issue {
                              title
                              body
                              url
                              state
                              createdAt
                              author {
                                  login
                              }
                          }
                      }
                  }`,
          variables: {
            input: params.githubIssueInput,
          },
        }),
      })
      .then((response) => response.data.data.createIssue)
      .catch((err: Error) => {
        logger.error(err);
        throw new Error('createGithubIssue operation failed');
      });
    return githubResponse;
  },
  {
    connection: redisConnection,
  }
);
