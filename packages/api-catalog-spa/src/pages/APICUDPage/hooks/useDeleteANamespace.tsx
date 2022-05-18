import { useMutation, UseMutationResponse } from 'urql';
import { Namespace } from 'api/types';

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

type UseDeleteNamespaceReturn = { deleteNamespace: Pick<Namespace, 'id' | 'name'> };

export const useDeleteANamespace = (): UseMutationResponse<
  UseDeleteNamespaceReturn,
  DeleteNamespaceVariable
> => {
  const deleteNamespaceMutation = useMutation<UseDeleteNamespaceReturn, DeleteNamespaceVariable>(
    DELETE_NAMESPACE
  );
  return deleteNamespaceMutation;
};
