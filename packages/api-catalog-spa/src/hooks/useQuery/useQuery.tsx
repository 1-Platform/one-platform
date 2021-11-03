import { useQuery as useUrqlQuery, UseQueryArgs } from 'urql';
import { Props, UseQueryReturn } from './types';

export const useQuery = <T extends unknown, V extends unknown>({
  gql,
  variables,
  ...props
}: Props<V> & Omit<UseQueryArgs<V, T>, 'query' | 'variable'>): UseQueryReturn<T> => {
  const [query, reFetchQuery] = useUrqlQuery<T, V>({
    query: gql,
    variables,
    ...props,
  });

  const isLoading = query.fetching;
  const isError = Boolean(query.error);

  return {
    isLoading,
    data: query.data,
    error: query.error,
    isError,
    reFetchQuery,
  };
};
