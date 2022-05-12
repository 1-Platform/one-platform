import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
  Title,
  Divider,
  DataList,
  DataListItem,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  EmptyState,
  EmptyStateIcon,
  DataListAction,
  Label,
  Tooltip,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

import { config } from 'config';
import { useURLParser } from 'hooks';
import { Environments, ApiCategory } from 'api/types';
import { ConditionalWrapper } from 'components';

import styles from './apiEnvironmentSection.module.scss';

interface Props {
  environments?: Environments[];
  category?: ApiCategory;
}

const SWAGGER_ICON = `${config.baseURL}/images/swagger-logo.svg`;
const PLAYGROUND_ICON = `${config.baseURL}/images/gql-playground-logo.svg`;
const REDOC_LOGO = `${config.baseURL}/images/redoc-logo.png`;

export const ApiEnvironmentSection = ({ environments = [], category }: Props): JSX.Element => {
  const urlParser = useURLParser();

  const getToolTip = useCallback(
    (child: JSX.Element) => (
      <Tooltip content="Owners didn't add schema for these environment">{child}</Tooltip>
    ),
    []
  );

  return (
    <Stack hasGutter style={{ width: '85%' }}>
      <StackItem>
        <Title headingLevel="h3">Environments</Title>
        <Divider />
      </StackItem>
      <StackItem>
        {environments.length === 0 && (
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No environments found
            </Title>
          </EmptyState>
        )}
        <DataList aria-label="environment-list" className={styles['catalog-env-list']} isCompact>
          {environments.map(({ apiBasePath, name, slug, isPublic, schemaEndpoint }) => (
            <DataListItem key={`${name}-${apiBasePath}`} className="pf-u-p-xs">
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell
                      key="stage"
                      className="pf-u-display-flex pf-u-align-items-center"
                      isFilled={false}
                    >
                      <span id="simple-item1" className="uppercase pf-u-font-weight-bold">
                        {name}
                      </span>
                      {!isPublic && (
                        <Label
                          isCompact
                          color="red"
                          style={{ fontSize: '0.5rem' }}
                          className="pf-u-ml-xs"
                        >
                          VPN
                        </Label>
                      )}
                    </DataListCell>,
                    <DataListCell
                      key="secondary content"
                      className="pf-u-display-flex pf-u-align-items-center pf-u-justify-content-center"
                    >
                      <a
                        href={apiBasePath}
                        className={styles['catalog-mailing-list']}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {urlParser(apiBasePath)}
                      </a>
                    </DataListCell>,
                  ]}
                />
                <ConditionalWrapper isWrapped={!schemaEndpoint} wrapper={getToolTip}>
                  <DataListAction
                    aria-labelledby="check-action-item2 check-action-action2"
                    id="check-action-action2"
                    aria-label="Actions"
                    className="pf-u-display-flex pf-u-align-items-center"
                    style={{ filter: !schemaEndpoint ? 'grayscale(100%)' : '' }}
                  >
                    {category === ApiCategory.GRAPHQL ? (
                      <Tooltip content="Playground">
                        <Link to={schemaEndpoint ? `/apis/graphql/playground/${slug}` : '#'}>
                          <Split style={{ whiteSpace: 'nowrap' }}>
                            <SplitItem style={{ height: '1.5rem', width: '1.5rem' }}>
                              <img
                                src={PLAYGROUND_ICON}
                                alt="playground"
                                style={{
                                  height: '1.5rem',
                                  width: '1.5rem',
                                  borderRadius: '12px',
                                }}
                              />
                            </SplitItem>
                            <SplitItem className="pf-u-ml-xs pf-u-display-flex pf-u-align-items-center">
                              <span className="pf-u-font-size-xs">Try it</span>
                            </SplitItem>
                          </Split>
                        </Link>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip content="Swagger">
                          <Link to={schemaEndpoint ? `/apis/rest/swagger/${slug}` : '#'}>
                            <Split style={{ whiteSpace: 'nowrap' }}>
                              <SplitItem style={{ height: '1.5rem', width: '1.5rem' }}>
                                <img
                                  src={SWAGGER_ICON}
                                  alt="swagger"
                                  style={{
                                    height: '1.5rem',
                                    width: '1.5rem',
                                    borderRadius: '12px',
                                  }}
                                />
                              </SplitItem>
                              <SplitItem className="pf-u-ml-xs pf-u-display-flex pf-u-align-items-center">
                                <span className="pf-u-font-size-xs ">Try it</span>
                              </SplitItem>
                            </Split>
                          </Link>
                        </Tooltip>
                        <Tooltip content="Redoc">
                          <Link to={schemaEndpoint ? `/apis/rest/redoc/${slug}` : '#'}>
                            <Split style={{ whiteSpace: 'nowrap' }}>
                              <SplitItem style={{ height: '1.5rem', width: '1.5rem' }}>
                                <img
                                  src={REDOC_LOGO}
                                  alt="redoc"
                                  style={{
                                    height: '1.5rem',
                                    width: '1.5rem',
                                    borderRadius: '12px',
                                  }}
                                />
                              </SplitItem>
                              <SplitItem className="pf-u-ml-xs pf-u-display-flex pf-u-align-items-center">
                                <span className="pf-u-font-size-xs">Try it</span>
                              </SplitItem>
                            </Split>
                          </Link>
                        </Tooltip>
                      </>
                    )}
                  </DataListAction>
                </ConditionalWrapper>
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </StackItem>
    </Stack>
  );
};
