import { Queue, QueueOptions } from 'bullmq';
import { JIRA_JOB_NAME } from '../jobs/createJira';
import { GITLAB_JOB_NAME } from '../jobs/createGitlabIssue';
import { GITHUB_JOB_NAME } from '../jobs/createGithubIssue';

export const redisConfiguration: QueueOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT ?? '6379'),
  }
}

export const jiraQueue = new Queue(JIRA_JOB_NAME, redisConfiguration);
export const gitlabQueue = new Queue(GITLAB_JOB_NAME, redisConfiguration);
export const githubQueue = new Queue(GITHUB_JOB_NAME, redisConfiguration);
