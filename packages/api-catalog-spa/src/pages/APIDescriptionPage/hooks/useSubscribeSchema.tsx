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
  subscribeApiSchema: Omit<Namespace, 'updatedBy'>;
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
