import { useQuery } from 'hooks';
import { NamespaceStat } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_NAMESPACE_STATS = /* GraphQL */ `
  query Query($search: String, $mid: String) {
    getApiCategoryCount(search: $search, mid: $mid) {
      total
      graphql
      rest
    }
  }
`;

type UseGetNamespaceStats = { getApiCategoryCount: NamespaceStat };

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
