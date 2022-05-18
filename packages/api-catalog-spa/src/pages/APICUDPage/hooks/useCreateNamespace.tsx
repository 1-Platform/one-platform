import { useMutation, UseMutationResponse } from 'urql';
import { Namespace } from 'api/types';
import { CreateNamespaceType } from './types';

const CREATE_NAMESPACE_MUTATION = /* GraphQL */ `
  mutation ($payload: CreateNamespaceInput!) {
    createNamespace(payload: $payload) {
      id
      name
      slug
    }
  }
`;

type CreateNamespaceVariable = {
  payload: CreateNamespaceType;
};

export type UseCreateNamespaceReturn = {
  createNamespace: Pick<Namespace, 'id' | 'name' | 'slug'>;
};

export const useCreateNamespace = (): UseMutationResponse<
  UseCreateNamespaceReturn,
  CreateNamespaceVariable
> => {
  const namespaceMutation = useMutation<UseCreateNamespaceReturn, CreateNamespaceVariable>(
    CREATE_NAMESPACE_MUTATION
  );
  return namespaceMutation;
};
