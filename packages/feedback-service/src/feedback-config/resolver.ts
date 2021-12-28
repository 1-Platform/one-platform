/* eslint-disable @typescript-eslint/no-unused-vars */
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
  },
  Mutation: {
    createFeedbackConfig(
      root: any,
      { payload }: MutationCreateFeedbackConfigArgs,
      ctx: any,
    ) {
      return new FeedbackConfig(payload).save();
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
      return FeedbackConfig.findByIdAndRemove(id).exec();
    },
  },
};

export { FeedbackConfigResolver as default };
