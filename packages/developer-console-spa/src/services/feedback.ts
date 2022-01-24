import { getAppFeedbacks } from "../utils/gql-queries";
import gqlClient from "../utils/gqlClient";

type Filters = {
  limit?: number;
  offset?: number;
  search?: string;
  sortBy?: string;
};

export const getAppFeedbacksService = async (
  appId: string,
  { limit = 20, offset = 0, search = "", sortBy }: Filters = {}
): Promise<{ count: number; data: Partial<FeedbackType>[] }> => {
  return gqlClient({
    query: getAppFeedbacks,
    variables: {
      appId: [appId],
      limit,
      offset,
      search,
      sortBy,
    },
  })
    .then((res) => {
      if (res?.errors && !res?.data?.listFeedbacks) {
        const errMessage = res.errors.map((err: any) => err.message).join(", ");
        throw new Error(errMessage);
      }
      return res.data.listFeedbacks;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};
