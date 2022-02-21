import { useCallback, useEffect } from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';

import { useRecentVisit } from 'context/RecentVisitContext';
import { useGetANamespace } from './hooks/useGetANamespace';

export const SwaggerToolPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { handleAddNewLog, handleRemoveLog } = useRecentVisit();
  const { isLoading, data: namespaceData } = useGetANamespace({ id });

  useEffect(() => {
    if (!isLoading && id) {
      if (namespaceData?.getNamespaceById) {
        const namespace = namespaceData?.getNamespaceById;
        handleAddNewLog({ title: namespace?.name || '', tool: 'swagger', url: pathname, id });
      } else {
        handleRemoveLog(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, id, namespaceData?.getNamespaceById]);
  const namespace = namespaceData?.getNamespaceById;

  const onRequestInterceptor = useCallback(
    (request) => {
      const headers = namespace?.headers;
      headers?.forEach(({ key, value }) => {
        request.headers[key] = value;
      });
      /**
        CORS error causes Swagger to break.
        Thus request is proxied through reverse proxy to inject CORS
       */
      request.url = `${process.env.REACT_APP_NO_CORS_PROXY}/${request.url}`;
      return request;
    },
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

  return <SwaggerUI url={namespace?.schemaEndpoint} requestInterceptor={onRequestInterceptor} />;
};
