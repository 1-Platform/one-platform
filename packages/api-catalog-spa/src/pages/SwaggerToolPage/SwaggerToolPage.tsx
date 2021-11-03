import { useCallback, useEffect } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useParams, useLocation } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';

import { useRecentVisit } from 'context/RecentVisitContext';
import { useGetANamespace } from './hooks/useGetANamespace';

export const SwaggerToolPage = (): JSX.Element => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { handleAddNewLog } = useRecentVisit();
  const { isLoading, data: namespaceData } = useGetANamespace({ id });

  useEffect(() => {
    if (!isLoading && namespaceData?.getNamespaceById) {
      const namespace = namespaceData?.getNamespaceById;
      handleAddNewLog({ title: namespace?.name || '', tool: 'swagger', url: pathname, id });
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

  return <SwaggerUI url={namespace?.schemaEndpoint} requestInterceptor={onRequestInterceptor} />;
};
