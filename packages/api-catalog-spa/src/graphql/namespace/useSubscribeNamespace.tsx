import { useMutation, UseMutationResponse } from 'urql';
import { ApiSubscribeType, Namespace } from './types';

const SUBSCRIBE_NAMESPACE = `
  mutation ($id: ID!, $payload: ApiSubscriberInput!) {
  addNamespaceSubscriber(id: $id, payload: $payload) {
    id
  }
}
`;

type SubscribeNamespaceVariable = {
  id: string;
  payload: ApiSubscribeType;
};

type UseSubscribeNamespaceReturn = { addNamespaceSubscriber: Namespace };

export const useSubscribeNamespace = (): UseMutationResponse<
  UseSubscribeNamespaceReturn,
  SubscribeNamespaceVariable
> => {
  const subscribeMutation = useMutation<UseSubscribeNamespaceReturn, SubscribeNamespaceVariable>(
    SUBSCRIBE_NAMESPACE
  );
  return subscribeMutation;
};
