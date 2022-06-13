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
      outageStatus {
        id
        name
        status
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
        cmdbAppID
        environments {
          id
          slug
          name
          apiBasePath
          schemaEndpoint
          isSubscribed
          isPublic
          isSchemaInValid
        }
        lastCheckedOn
        createdOn
        updatedOn
      }
      createdOn
      updatedOn
      createdBy {
        rhatUUID
      }
    }
  }
`;
type UseGetANamespaceQuery = {
  getNamespaceBySlug: Omit<Namespace, 'updatedBy'>;
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
