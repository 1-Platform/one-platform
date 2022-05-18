import { useMutation, UseMutationResponse } from 'urql';
import { Namespace } from 'api/types';

const SUBSCRIBE_SCHEMA = /* GraphQL */ `
  mutation Mutation($config: SubscribeSchema!) {
    subscribeApiSchema(config: $config) {
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

type ApiSubscribeType = {
  namespaceID: String;
  schemaID: String;
  envIDs: String[];
  email: String;
};

type SubscribeNamespaceVariable = {
  config: ApiSubscribeType;
};

type UseSubscribeSchemaReturn = {
  subscribeApiSchema: Omit<Namespace, 'createdBy' | 'updatedBy'>;
};

export const useSubscribeSchema = (): UseMutationResponse<
  UseSubscribeSchemaReturn,
  SubscribeNamespaceVariable
> => {
  const subscribeMutation = useMutation<UseSubscribeSchemaReturn, SubscribeNamespaceVariable>(
    SUBSCRIBE_SCHEMA
  );
  return subscribeMutation;
};
