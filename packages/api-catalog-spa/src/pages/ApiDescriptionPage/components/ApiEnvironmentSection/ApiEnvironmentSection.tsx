import { useCallback } from 'react';
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
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Environments } from 'graphql/namespace/types';

import { urlProtocolRemover } from 'utils';
import styles from './apiEnvironmentSection.module.scss';

interface Props {
  environments?: Environments[];
}

export const ApiEnvironmentSection = ({ environments = [] }: Props): JSX.Element => {
  const urlParser = useCallback((url: string) => urlProtocolRemover(url), []);

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
        <DataList aria-label="environment-list" className={styles['catalog-env-list']}>
          {environments.map(({ apiBasePath, name }) => (
            <DataListItem key={`${name}-${apiBasePath}`}>
              <DataListItemRow>
                <DataListItemCells
                  dataListCells={[
                    <DataListCell key="stage">
                      <span id="simple-item1" className="capitalize pf-u-font-weight-bold">
                        {name}
                      </span>
                    </DataListCell>,
                    <DataListCell key="secondary content">
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
              </DataListItemRow>
            </DataListItem>
          ))}
        </DataList>
      </StackItem>
    </Stack>
  );
};
