import { useQuery } from 'hooks';

import { Pagination, Namespace, ApiCategory, ApiSchema } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_NAMESPACE_LIST = /* GraphQL */ `
  query (
    $limit: Int
    $offset: Int
    $apiCategory: ApiCategory
    $search: String
    $sortBy: NamespaceSortType
    $mid: String
  ) {
    listNamespaces(
      limit: $limit
      offset: $offset
      apiCategory: $apiCategory
      search: $search
      sortBy: $sortBy
      mid: $mid
    ) {
      count
      data {
        id
        name
        slug
        schemas {
          id
          name
          category
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
type UseGetNamespaceListQuery = {
  listNamespaces: Pagination<
    (Pick<Namespace, 'id' | 'name' | 'slug' | 'owners' | 'updatedOn'> & {
      schemas: Pick<ApiSchema, 'id' | 'name' | 'category'>[];
    })[]
  >;
};

type Props = {
  limit?: number;
  offset?: number;
  apiCategory: null | ApiCategory;
  search?: string;
  sortBy?: null | 'CREATED_ON' | 'UPDATED_ON';
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
