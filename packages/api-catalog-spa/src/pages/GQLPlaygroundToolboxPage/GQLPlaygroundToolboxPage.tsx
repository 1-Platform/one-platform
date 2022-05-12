import { useMemo } from 'react';
import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { CubeIcon } from '@patternfly/react-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Playground, store } from 'graphql-playground-react';

import { useRegisterRecentVisit, useToggle } from 'hooks';
import { useGetApiSchemaFile } from './hooks';

const GQLPlaygroundToolboxPage = (): JSX.Element => {
  const { envSlug } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoading, data: schemaData } = useGetApiSchemaFile({ envSlug });
  const [isDecodingFile, setIsDecodingFile] = useToggle();

  const schema = schemaData?.fetchAPISchema?.schema;
  const namespaceSlug = schemaData?.fetchAPISchema?.namespaceSlug;
  const file = schemaData?.fetchAPISchema?.file;

  useRegisterRecentVisit({
    isLoading: isLoading && !envSlug,
    log: useMemo(
      () => ({
        title: schema?.name || '',
        tool: 'playground',
        url: pathname,
        id: namespaceSlug as string,
        envSlug: envSlug as string,
      }),
      [pathname, namespaceSlug, schema?.name, envSlug]
    ),
    onRemoveId: namespaceSlug,
  });

  const env = useMemo(() => {
    if (schema) {
      return schema.environments.find(({ slug }) => slug === envSlug);
    }
    return { apiBasePath: '' };
  }, [schema, envSlug]);

  const schemaFile = useMemo(() => {
    if (file) {
      try {
        setIsDecodingFile.on();
        const data = JSON.parse(window.atob(file));
        return data.data as object;
      } catch (error) {
        window.OpNotification.danger({
          subject: 'Failed to parse file!!',
        });
      } finally {
        setIsDecodingFile.off();
      }
    }
    return '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  if (isLoading || isDecodingFile) {
    return (
      <Bullseye>
        <Spinner size="xl" />
      </Bullseye>
    );
  }

  if (!file) {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CubeIcon} />
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
        endpoint={env?.apiBasePath}
        schema={schemaFile}
        settings={{
          'editor.theme': 'light',
          'schema.enablePolling': false,
        }}
      />
    </Provider>
  );
};

export default GQLPlaygroundToolboxPage;
