import { useQuery } from 'hooks';
import { Namespace } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_A_NAMESPACE = /* GraphQL */ `
  query ($slug: ID!) {
    getNamespaceBySlug(slug: $slug) {
      id
      name
      description
      owners {
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
      schemas {
        id
        name
        appURL
        docURL
        category
        flags {
          isInternal
          isDeprecated
        }
        environments {
          id
          slug
          name
          apiBasePath
          schemaEndpoint
          isSubscribed
          isPublic
        }
        lastCheckedOn
        createdOn
        updatedOn
      }
      createdOn
      updatedOn
    }
  }
`;
type UseGetANamespaceQuery = {
  getNamespaceBySlug: Omit<Namespace, 'createdBy' | 'updatedBy'>;
};

type Props = {
  slug?: string;
};

export const useGetANamespaceBySlug = ({ slug }: Props): UseQueryReturn<UseGetANamespaceQuery> => {
  const query = useQuery<UseGetANamespaceQuery, Props>({
    gql: GET_A_NAMESPACE,
    variables: {
      slug,
    },
  });

  return query;
};
