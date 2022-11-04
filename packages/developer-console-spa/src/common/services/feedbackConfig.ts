import { CreateFeedbackConfig, UpdateFeedbackConfig } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export const createFeedbackConfigService = async (
  payload: Partial<FeedbackConfig>
) => {
  return gqlClient({
    query: CreateFeedbackConfig,
    variables: {
      payload,
    },
  })
    .then((res) => {
      if (res.errors && !res?.data?.createFeedbackConfig) {
        const errMessage = res.errors.map((err: any) => err.message).join(', ');
        throw new Error(errMessage);
      }
      return res.data.createFeedbackConfig;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

export const updateFeedbackConfigService = async (
  id: string,
  payload: Partial<FeedbackConfig>
) => {
  return gqlClient({
    query: UpdateFeedbackConfig,
    variables: {
      id,
      payload,
    },
  })
    .then((res) => {
      if (res.errors && !res?.data?.updateFeedbackConfig) {
        const errMessage = res.errors.map((err: any) => err.message).join(', ');
        throw new Error(errMessage);
      }
      return res.data.updateFeedbackConfig;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
