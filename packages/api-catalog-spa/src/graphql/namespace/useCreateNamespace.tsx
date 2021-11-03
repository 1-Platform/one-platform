import { useMutation, UseMutationResponse } from 'urql';
import { Namespace, ApiEmailGroup } from './types';

const CREATE_NAMESPACE_MUTATION = `
  mutation ($payload: NamespaceInput!) {
    createNamespace (payload: $payload) {
      id
      name
    }
  }
`;

type Payload = Omit<
  Namespace,
  | 'id'
  | 'hash'
  | 'lastCheckedOn'
  | 'createdOn'
  | 'updatedOn'
  | 'updatedBy'
  | 'tags'
  | 'subscribers'
  | 'owners'
> & {
  owners: {
    mid: string;
    group: ApiEmailGroup;
  }[];
};

type CreateNamespaceVariable = {
  payload: Payload;
};

export type UseCreateNamespaceReturn = { createNamespace: Namespace };

export const useCreateNamespace = (): UseMutationResponse<
  UseCreateNamespaceReturn,
  CreateNamespaceVariable
> => {
  const namespaceMutation = useMutation<UseCreateNamespaceReturn, CreateNamespaceVariable>(
    CREATE_NAMESPACE_MUTATION
  );
  return namespaceMutation;
};
