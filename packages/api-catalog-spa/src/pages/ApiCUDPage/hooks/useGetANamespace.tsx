import { useQuery } from 'hooks';

import { Namespace } from 'graphql/namespace/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_A_NAMESPACE = `
query ($id: ID!) {
  getNamespaceById(id: $id) {
    id
    name
    description
    category
    appUrl
    schemaEndpoint
    createdBy {
      cn
      rhatUUID
    }
    headers {
      key
      value
    }
    environments {
      apiBasePath
      name
    }
    owners {
      __typename
      ... on OwnerMailingType {
        email
        group
      }
      ... on OwnerUserType {
        user {
          mail
          rhatUUID
        }
        group
      }
    }
  }
}
`;
type UseGetANamespaceQuery = {
  getNamespaceById: Namespace;
};

type Props = {
  id: string;
};

export const useGetANamespace = ({ id }: Props): UseQueryReturn<UseGetANamespaceQuery> => {
  const query = useQuery<UseGetANamespaceQuery, Props>({
    gql: GET_A_NAMESPACE,
    variables: {
      id,
    },
    pause: !id,
  });

  return query;
};
