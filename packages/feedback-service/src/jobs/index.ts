import {createJira} from './createJira';
import {createGitlabIssue} from './createGitlabIssue';
import {createGithubIssue} from './createGithubIssue';

export type WorkerProps = {
  feedbackConfig: FeedbackConfigType,
  userFeedback: FeedbackType,
  app: any,
  userData: any,
}

export const setupWorkers = () => ({
  createJira,
  createGitlabIssue,
  createGithubIssue,
});
