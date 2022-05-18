import { useQuery } from 'hooks';
import { Namespace, UserRoverDetails } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

const GET_A_NAMESPACE = /* GraphQL */ `
  query ($slug: ID!) {
    getNamespaceBySlug(slug: $slug) {
      id
      name
      description
      slug
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
        description
        appURL
        docURL
        category
        flags {
          isInternal
          isDeprecated
        }
        environments {
          slug
          id
          name
          apiBasePath
          headers {
            id
            key
          }
          isPublic
          schemaEndpoint
        }
      }
      createdBy {
        rhatUUID
      }
    }
  }
`;
type UseGetANamespaceQuery = {
  getNamespaceBySlug: Omit<Namespace, 'createdBy' | 'updatedBy' | 'updatedOn' | 'createdOn'> & {
    createdBy: Pick<UserRoverDetails, 'rhatUUID'>;
  };
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
    pause: !slug,
  });

  return query;
};
