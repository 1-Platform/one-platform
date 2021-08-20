import { FetchPolicy } from '@apollo/client/core';

export type GraphqlConfig = {
  apiBasePath: string;
  subscriptionsPath: string;
  cachePolicy?: FetchPolicy;
};
