import { Queue } from 'bullmq';
import { JIRA_JOB_NAME } from '../jobs/createJira';
import { GITLAB_JOB_NAME } from '../jobs/createGitlabIssue';
import { GITHUB_JOB_NAME } from '../jobs/createGithubIssue';
import { redisConnection } from './redis';

export const jiraQueue = new Queue(JIRA_JOB_NAME, { connection: redisConnection });
export const gitlabQueue = new Queue(GITLAB_JOB_NAME, { connection: redisConnection });
export const githubQueue = new Queue(GITHUB_JOB_NAME, { connection: redisConnection });
