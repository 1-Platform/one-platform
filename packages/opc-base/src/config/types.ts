import { RequestPolicy } from '@urql/core';

export type GraphqlConfig = {
  apiBasePath: string;
  subscriptionsPath: string;
  cachePolicy?: RequestPolicy;
};
