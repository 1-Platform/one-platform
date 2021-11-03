import { useQuery } from 'hooks';

import { NamespaceStat } from 'graphql/namespace/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_NAMESPACE_STATS = `
query Query($search: String, $mid: String) {
  getNamespaceCount(search: $search, mid: $mid) {
    all
    graphql
    rest
  }
}
`;
type UseGetNamespaceStats = { getNamespaceCount: NamespaceStat };

type Props = {
  search?: string;
  mid?: string | null;
};

export const useGetNamespaceStats = ({
  search,
  mid,
}: Props): UseQueryReturn<UseGetNamespaceStats> => {
  const query = useQuery<UseGetNamespaceStats, Props>({
    gql: GET_NAMESPACE_STATS,
    variables: {
      search,
      mid,
    },
  });

  return query;
};
