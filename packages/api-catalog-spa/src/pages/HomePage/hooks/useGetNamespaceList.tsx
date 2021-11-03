import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from 'hooks';

import { Namespace } from 'graphql/namespace/types';
import { UseQueryReturn } from 'hooks/useQuery/types';
import { Pagination } from 'graphql/types';

const GET_NAMESPACE_LIST = `
query ($limit: Int, $search: String) {
  listNamespaces(limit: $limit, search: $search) {
       count
       data {
           id
           name
           category
           description
        }
  }
}
`;
type UseGetNamespaceListQuery = { listNamespaces: Pagination<Namespace[]> };

type Props = {
  limit?: number;
  search?: string;
};

export const useGetNamespaceList = ({
  limit = 10,
  search,
}: Props): UseQueryReturn<UseGetNamespaceListQuery> => {
  const searchCancelRef = useRef(new AbortController());
  const query = useQuery<UseGetNamespaceListQuery, Props>({
    gql: GET_NAMESPACE_LIST,
    variables: {
      limit,
      search,
    },
    pause: !search,
    context: useMemo(
      () => ({
        fetchOptions: () => {
          const token = window.OpAuthHelper.jwtToken;
          return {
            signal: searchCancelRef.current.signal,
            headers: { authorization: token ? `Bearer ${token}` : '' },
          };
        },
      }),
      []
    ),
  });

  useEffect(() => {
    searchCancelRef.current.abort();
  }, [search]);

  return query;
};
