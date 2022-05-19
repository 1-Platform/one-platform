import { useEffect, useMemo, useRef } from 'react';
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
import yaml from 'js-yaml';
import { loadThirdPartyScript } from 'utils';
import { useRegisterRecentVisit, useToggle } from 'hooks';
import { useGetApiSchemaFile } from './hooks';

const RedocToolboxPage = (): JSX.Element => {
  const { envSlug } = useParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoading, data: schemaData } = useGetApiSchemaFile({ envSlug });
  const [isDecodingFile, setIsDecodingFile] = useToggle();
  const redocContainer = useRef<HTMLDivElement>(null);

  const schema = schemaData?.fetchAPISchema?.schema;
  const namespaceSlug = schemaData?.fetchAPISchema?.namespaceSlug;
  const file = schemaData?.fetchAPISchema?.file;

  useEffect(() => {
    loadThirdPartyScript(
      'https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js',
      'redoc-script',
      () => {
        window.process = { ...(window.process || {}), cwd: () => '' };
      },
      () =>
        window.OpNotification.danger({
          subject: 'Failed to load redoc',
        })
    );
  }, []);

  useEffect(() => {
    if (file && typeof Redoc !== 'undefined') {
      try {
        setIsDecodingFile.on();
        const data = yaml.load(window.atob(file));
        Redoc.init(data, {}, document.getElementById('redoc-container'));
      } catch (error) {
        window.OpNotification.danger({
          subject: 'Failed to parse file!!',
        });
      } finally {
        setIsDecodingFile.off();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, typeof Redoc]);

  useRegisterRecentVisit({
    isLoading: isLoading || isDecodingFile,
    log: useMemo(
      () => ({
        title: schema?.name || '',
        tool: 'redoc',
        url: pathname,
        id: namespaceSlug as string,
        envSlug: envSlug as string,
      }),
      [pathname, namespaceSlug, schema?.name, envSlug]
    ),
    onRemoveId: namespaceSlug,
  });

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

  return <div id="redoc-container" ref={redocContainer} />;
};

export default RedocToolboxPage;
