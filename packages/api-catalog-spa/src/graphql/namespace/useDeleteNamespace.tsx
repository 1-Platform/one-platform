import { useMutation, UseMutationResponse } from 'urql';
import { Namespace } from './types';

const DELETE_NAMESPACE = `
  mutation ($id: ID!) {
  deleteNamespace(id: $id) {
    id
    name
  }
}
`;

type DeleteNamespaceVariable = {
  id: string;
};

type UseDeleteNamespaceReturn = { deleteNamespace: Namespace };

export const useDeleteNamespace = (): UseMutationResponse<
  UseDeleteNamespaceReturn,
  DeleteNamespaceVariable
> => {
  const deleteNamespaceMutation = useMutation<UseDeleteNamespaceReturn, DeleteNamespaceVariable>(
    DELETE_NAMESPACE
  );
  return deleteNamespaceMutation;
};
