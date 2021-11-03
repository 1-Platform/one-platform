import { useQuery } from 'hooks';

import { ApiCategory, Namespace } from 'graphql/namespace/types';
import { UseQueryReturn } from 'hooks/useQuery/types';
import { Pagination } from 'graphql/types';

const GET_NAMESPACE_LIST = `
query ($limit: Int, $offset: Int, $apiCategory: ApiCategory, $search: String, $sortBy: ApiSortType,$mid: String) {
  listNamespaces(limit: $limit,offset: $offset,apiCategory: $apiCategory, search: $search, sortBy: $sortBy, mid:$mid) {
       count
   data {
    id
    name
    category
    appUrl
    createdBy {
      cn
    }
    owners {
      __typename
      ... on OwnerMailingType {
        email
        group
      }
      ... on OwnerUserType {
        user {
          cn
          rhatJobTitle
        }
        group
      }
    }
    updatedOn
   }
  }
}
`;
type UseGetNamespaceListQuery = { listNamespaces: Pagination<Namespace[]> };

type Props = {
  limit?: number;
  offset?: number;
  apiCategory: null | ApiCategory;
  search?: string;
  sortBy?: null | 'CREATED_AT' | 'UPDATED_AT';
  mid?: string | null;
};

export const useGetNamespaceList = ({
  limit = 20,
  offset = 0,
  apiCategory,
  search,
  sortBy,
  mid,
}: Props): UseQueryReturn<UseGetNamespaceListQuery> => {
  const query = useQuery<UseGetNamespaceListQuery, Props>({
    gql: GET_NAMESPACE_LIST,
    variables: {
      limit,
      offset,
      apiCategory,
      search,
      sortBy,
      mid,
    },
  });

  return query;
};
