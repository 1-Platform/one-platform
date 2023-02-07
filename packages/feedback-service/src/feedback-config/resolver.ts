/* eslint-disable @typescript-eslint/no-unused-vars */
import { Feedback } from '../feedbacks/schema';
import Logger from '../lib/logger';
import { FeedbackConfig } from './schema';

const FeedbackConfigResolver = {
  Query: {
    listFeedbackConfigs() {
      return FeedbackConfig.find()
        .exec()
        .then((response: any) => response)
        .catch((error: Error) => error);
    },
    getFeedbackConfigById(
      root: any,
      { id }: QueryListFeedbackConfigByIdArgs,
      ctx: any,
    ) {
      return FeedbackConfig.findById(id)
        .exec()
        .then((response: any) => response)
        .catch((error: Error) => error);
    },
    getFeedbackConfigByAppId(
      root: any,
      { appId }: QueryListFeedbackConfigByAppIdArgs,
      ctx: any,
    ) {
      return FeedbackConfig.findOne({ appId })
        .exec()
        .then((response: any) => response)
        .catch((error: Error) => error);
    },
    getFeedbackConfigByProjectId(
      root: any,
      { projectId }: QueryListFeedbackConfigByAppIdArgs,
      ctx: any,
    ) {
      return FeedbackConfig.findOne({ projectId }).exec();
    },
    getFeedbackConfigByProjectKey(
      root: any,
      { projectKey }: QueryListFeedbackConfigByAppIdArgs,
      ctx: any,
    ) {
      return FeedbackConfig.find({ projectKey }).exec();
    },
  },
  Mutation: {
    createFeedbackConfig(
      root: any,
      { payload }: MutationCreateFeedbackConfigArgs,
      ctx: any,
    ) {
      return new FeedbackConfig(payload).save()
        .catch((error) => {
          Logger.error(error);
          return error;
        });
    },
    updateFeedbackConfig(
      root: any,
      { id, payload }: MutationUpdateFeedbackConfigArgs,
    ) {
      return FeedbackConfig.findByIdAndUpdate(id, payload, {
        new: true,
      }).exec();
    },
    deleteFeedbackConfig(
      root: any,
      { id }: MutationDeleteFeedbackConfigArgs,
      ctx: any,
    ) {
      return FeedbackConfig.findByIdAndRemove(id)
        .then((response: any) => {
          Feedback.remove({ config: id }).exec();
          return response;
        });
    },
  },
};

export { FeedbackConfigResolver as default };
