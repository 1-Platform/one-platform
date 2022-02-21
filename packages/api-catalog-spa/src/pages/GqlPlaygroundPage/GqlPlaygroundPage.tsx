import { useEffect, useMemo } from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Playground, store } from 'graphql-playground-react';
import { Provider } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useRecentVisit } from 'context/RecentVisitContext';
import { useGetANamespace } from './hooks/useGetANamespace';

export const GqlPlaygroundPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleAddNewLog, handleRemoveLog } = useRecentVisit();
  const { isLoading, data: namespaceData } = useGetANamespace({ id });

  useEffect(() => {
    if (!isLoading && id) {
      if (namespaceData?.getNamespaceById) {
        const namespace = namespaceData?.getNamespaceById;
        handleAddNewLog({ title: namespace?.name || '', tool: 'playground', url: pathname, id });
      } else {
        handleRemoveLog(id);
      }
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

  if (!namespace) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            Sorry, Couldn&apos;t find this API
          </Title>
          <Button variant="primary" onClick={() => navigate('/apis')}>
            Go Back
          </Button>
        </EmptyState>
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
