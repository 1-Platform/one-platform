import { useMutation, UseMutationResponse } from 'urql';
import { Namespace } from 'api/types';
import { CreateNamespaceType } from './types';

const UPDATE_NAMESPACE_MUTATION = /* GraphQL */ `
  mutation ($id: ID!, $payload: UpdateNamespaceInput!) {
    updateNamespace(id: $id, payload: $payload) {
      id
      name
      slug
    }
  }
`;

type Payload = Partial<CreateNamespaceType>;

type UpdateNamespaceVariable = {
  id: string;
  payload: Payload;
};

type UseUpdateNamespaceReturn = { updateNamespace: Pick<Namespace, 'id' | 'name' | 'slug'> };

export const useUpdateNamespace = (): UseMutationResponse<
  UseUpdateNamespaceReturn,
  UpdateNamespaceVariable
> => {
  const namespaceMutation = useMutation<UseUpdateNamespaceReturn, UpdateNamespaceVariable>(
    UPDATE_NAMESPACE_MUTATION
  );
  return namespaceMutation;
};
