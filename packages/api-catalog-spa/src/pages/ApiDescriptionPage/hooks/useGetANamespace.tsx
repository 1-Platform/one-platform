import { useQuery } from 'hooks';

import { Namespace } from 'graphql/namespace/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_A_NAMESPACE = `
query ($id: ID!,$email: String!) {
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
          cn
          rhatJobTitle
          mail
          rhatUUID
        }
        group
      }
    }
    updatedOn
  }
  getNamespaceSubscriberStatus(id: $id, email: $email) {
    subscribed
  }
}
`;
type UseGetANamespaceQuery = {
  getNamespaceById: Namespace;
  getNamespaceSubscriberStatus: { subscribed: boolean };
};

type Props = {
  id: string;
  email: string;
};

export const useGetANamespace = ({ id, email }: Props): UseQueryReturn<UseGetANamespaceQuery> => {
  const query = useQuery<UseGetANamespaceQuery, Props>({
    gql: GET_A_NAMESPACE,
    variables: {
      id,
      email,
    },
  });

  return query;
};
