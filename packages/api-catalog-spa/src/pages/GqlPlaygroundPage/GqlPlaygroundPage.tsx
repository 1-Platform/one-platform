import { useEffect, useMemo } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { Playground, store } from 'graphql-playground-react';
import { Provider } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { useRecentVisit } from 'context/RecentVisitContext';
import { useGetANamespace } from './hooks/useGetANamespace';

export const GqlPlaygroundPage = (): JSX.Element => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { handleAddNewLog } = useRecentVisit();
  const { isLoading, data: namespaceData } = useGetANamespace({ id });

  useEffect(() => {
    if (!isLoading && namespaceData?.getNamespaceById) {
      const namespace = namespaceData?.getNamespaceById;
      handleAddNewLog({ title: namespace?.name || '', tool: 'playground', url: pathname, id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, id, namespaceData?.getNamespaceById]);

  const namespace = namespaceData?.getNamespaceById;

  const headers = useMemo(
    () =>
      namespace?.headers?.reduce<Record<string, string>>((prev, { key, value }) => {
        const header = { ...prev, [key]: value };
        return header;
      }, {}),
    [namespace?.headers]
  );

  if (isLoading) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  return (
    <Provider store={store}>
      <Playground
        endpoint={namespace?.schemaEndpoint}
        setTitle={namespace?.name || `One Platform | API Catalog`}
        headers={headers || null}
        settings={{
          'editor.theme': 'light',
          'request.credentials': 'omit',
        }}
      />
    </Provider>
  );
};
