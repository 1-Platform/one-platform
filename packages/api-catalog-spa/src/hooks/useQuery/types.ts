import { CombinedError, OperationContext } from 'urql';

export type Props<T extends unknown> = {
  gql: string;
  variables?: T;
};

export type UseQueryReturn<T extends unknown> = {
  isLoading: boolean;
  data?: T;
  error?: CombinedError;
  isError: boolean;
  reFetchQuery: (opts?: Partial<OperationContext> | undefined) => void;
};
