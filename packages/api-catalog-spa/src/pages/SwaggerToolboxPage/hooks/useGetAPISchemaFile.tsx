import { useQuery } from 'hooks';
import { ApiSchema, Environments } from 'api/types';
import { UseQueryReturn } from 'hooks/useQuery/types';

export const GET_API_SCHEMA_FILE = /* GraphQL */ `
  query FetchAPISchema($envSlug: String) {
    fetchAPISchema(envSlug: $envSlug, shouldValidate: false) {
      schema {
        name
        id
        description
        appURL
      }
      namespaceSlug
      file
    }
  }
`;

export type UseGetAPISchemaFileQuery = {
  fetchAPISchema: {
    schema: Pick<ApiSchema, 'id' | 'appURL' | 'name'> & {
      environments: Pick<Environments, 'slug' | 'apiBasePath' | 'name'>[];
    };
    file: string;
    namespaceSlug: string;
  };
};

export type UseGetAPISchemaFileVariable = {
  envSlug?: string;
};

type Props = {
  envSlug?: string;
};

export const useGetApiSchemaFile = ({
  envSlug,
}: Props): UseQueryReturn<UseGetAPISchemaFileQuery> => {
  const query = useQuery<UseGetAPISchemaFileQuery, Props>({
    gql: GET_API_SCHEMA_FILE,
    variables: {
      envSlug,
    },
  });

  return query;
};
