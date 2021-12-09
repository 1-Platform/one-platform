import { useCallback, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Voyager } from 'graphql-voyager';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useRecentVisit } from 'context/RecentVisitContext';
import { useGetANamespace } from './hooks/useGetANamespace';

export const VoyagerToolPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleAddNewLog, handleRemoveLog } = useRecentVisit();
  const { isLoading, data: namespaceData } = useGetANamespace({ id });

  useEffect(() => {
    if (!isLoading) {
      if (namespaceData?.getNamespaceById) {
        const namespace = namespaceData?.getNamespaceById;
        handleAddNewLog({ title: namespace?.name || '', tool: 'voyager', url: pathname, id });
      } else {
        handleRemoveLog(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, id, namespaceData?.getNamespaceById]);

  const namespace = namespaceData?.getNamespaceById;

  const introspectionProvider = useCallback(
    (query: string, authorizationToken: string) => {
      const headers = namespace?.headers?.reduce<Record<string, string>>((prev, { key, value }) => {
        const header = { ...prev, [key]: value };
        return header;
      }, {});
      return fetch(namespace?.schemaEndpoint || '', {
        method: 'POST',
        headers: { authorizationToken, 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ query }),
      }).then((response) => response.json());
    },
    [namespace?.headers, namespace?.schemaEndpoint]
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
    <Voyager
      introspection={introspectionProvider}
      workerURI="https://unpkg.com/graphql-voyager@1.0.0-rc.31/dist/voyager.worker.js"
    />
  );
};
