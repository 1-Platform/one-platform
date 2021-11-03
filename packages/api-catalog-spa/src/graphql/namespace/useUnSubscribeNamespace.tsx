import { useMutation, UseMutationResponse } from 'urql';
import { ApiSubscribeType, Namespace } from './types';

const UNSUBSCRIBE_NAMESPACE = `
  mutation ($id: ID!, $payload: ApiSubscriberInput!) {
  removeNamespaceSubscriber(id: $id, payload: $payload) {
    id
  }
}
`;

type UnsubscribeNamespaceVariable = {
  id: string;
  payload: ApiSubscribeType;
};

type UseUnsubscribeNamespaceReturn = { addNamespaceSubscriber: Namespace };

export const useUnsubscribeNamespace = (): UseMutationResponse<
  UseUnsubscribeNamespaceReturn,
  UnsubscribeNamespaceVariable
> => {
  const unsubscribeMutation = useMutation<
    UseUnsubscribeNamespaceReturn,
    UnsubscribeNamespaceVariable
  >(UNSUBSCRIBE_NAMESPACE);

  return unsubscribeMutation;
};
