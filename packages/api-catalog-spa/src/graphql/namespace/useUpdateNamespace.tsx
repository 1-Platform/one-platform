import { useMutation, UseMutationResponse } from 'urql';
import { Namespace, ApiEmailGroup } from './types';

const UPDATE_NAMESPACE_MUTATION = `
  mutation ($id: ID!, $payload: NamespaceInput!) {
    updateNamespace (id: $id,payload: $payload) {
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

type UpdateNamespaceVariable = {
  id: string;
  payload: Payload;
};

type UseUpdateNamespaceReturn = { UpdateNamespace: Namespace };

export const useUpdateNamespace = (): UseMutationResponse<
  UseUpdateNamespaceReturn,
  UpdateNamespaceVariable
> => {
  const namespaceMutation = useMutation<UseUpdateNamespaceReturn, UpdateNamespaceVariable>(
    UPDATE_NAMESPACE_MUTATION
  );
  return namespaceMutation;
};
