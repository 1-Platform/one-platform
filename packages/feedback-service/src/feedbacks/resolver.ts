/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 *
 * @version 0.0.5
 *
 * GraphQL interface for managing the business logic
 *
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-06-28 17:21:06
 */
import * as _ from 'lodash';
import { Feedback } from './schema';
import FeedbackHelper from './helpers';
import { FeedbackConfig } from '../feedback-config/schema';

const FeedbackResolver = {
  Query: {
    async listFeedbacks(root: any, args: any, ctx: any) {
      return Feedback.find()
        .sort({ createdOn: -1 })
        .exec()
        .then(async (feedbacks) => FeedbackHelper.processFeedbackRecords(feedbacks))
        .catch((error: Error) => error);
    },
    async getFeedbackById(root: any, args: any, ctx: any) {
      const userFeedback = await Feedback.findById(args.id)
        .exec();
      const responses = await FeedbackHelper.processFeedbackRecords([userFeedback]);
      return responses[0];
    },
  },
  Mutation: {
    async createFeedback(root: any, args: any, ctx: any) {
      let feedbackConfig: Array<FeedbackConfigType> = [];
      let app: any;
      const userFeedback = args.input;
      let userData: any[] = [];
      let integrationResponse;
      if (!userFeedback.createdBy) {
        throw new Error('Field `createdBy` is missing in the request');
      } else {
        const userQuery = FeedbackHelper.buildUserQuery([
          userFeedback.createdBy,
        ]);
        userData = await FeedbackHelper.getUserProfiles(userQuery);
      }
      if (!userFeedback.config && userFeedback?.stackInfo?.path) {
        const appList = await FeedbackHelper.listApps();
        app = appList.filter(
          (response: any) => response.path === `/${userFeedback.stackInfo.path.split('/')[1]}`,
        );
        if (app.length !== 0) {
          feedbackConfig = await FeedbackConfig.find({
            appId: app[0].id,
          }).exec();
          userFeedback.config = (feedbackConfig[0] as any)?._id;
        } else {
          throw new Error(
            'Feedback Configuration not registered. Visit Developer Console to register your Feedback Configuration',
          );
        }
      }
      if (feedbackConfig[0]?.sourceType === 'GITHUB') {
        integrationResponse = await FeedbackHelper.createGithubIssue(
          feedbackConfig,
          userFeedback,
          app,
          userData,
        );
        userFeedback.state = integrationResponse.issue.state;
      } else if (feedbackConfig[0]?.sourceType === 'JIRA') {
        integrationResponse = await FeedbackHelper.createJira(
          feedbackConfig,
          userFeedback,
          app,
          userData,
        );
        userFeedback.ticketUrl = `${new URL(integrationResponse.self).origin}/browse/${integrationResponse.key}`;
        userFeedback.state = 'To Do';
      } else if (feedbackConfig[0]?.sourceType === 'GITLAB') {
        integrationResponse = await FeedbackHelper.createGitlabIssue(
          feedbackConfig,
          userFeedback,
          app,
          userData,
        );
        userFeedback.state = integrationResponse.state;
      } else if (feedbackConfig[0]?.sourceType === 'EMAIL') {
        userFeedback.state = 'To Do';
      }

      if (feedbackConfig[0].sourceType !== 'JIRA') {
        userFeedback.ticketUrl = integrationResponse?.issue?.url
          || integrationResponse?.webUrl
          || null;
      }
      return new Feedback(userFeedback)
        .save()
        .then(async (response: any) => {
          const emailTemplate = FeedbackHelper.createEmailTemplate(
            userData,
            userFeedback,
            app,
            feedbackConfig[0],
          );
          FeedbackHelper.sendEmail(emailTemplate);
          const formattedSearchResponse = FeedbackHelper.formatSearchInput(
            response,
            userData,
          );
          FeedbackHelper.manageSearchIndex(formattedSearchResponse, 'index');
          return response;
        })
        .catch((error: Error) => error);
    },
    updateFeedback(root: any, { id, input }: any, ctx: any) {
      const userFeedback = input;
      return Feedback.findByIdAndUpdate(id, userFeedback, {
        new: true,
      }).exec();
    },
    async deleteFeedback(root: any, { id }: any, ctx: any) {
      const feedback = await Feedback.findByIdAndRemove(id).exec();
      if (!feedback) return null;
      return feedback;
    },
    updateFeedbackIndex(root: any, args: any, ctx: any) {},
  },
};

export { FeedbackResolver as default };
