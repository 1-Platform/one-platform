import { DOMAttributes, useCallback } from 'react';
import dayjs from 'dayjs/esm';
import {
  Card,
  CardBody,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Title,
  Text,
  TitleSizes,
  TextVariants,
  Label,
} from '@patternfly/react-core';
import { ReadMore } from 'components';
import { config } from 'config';

type Schemas = {
  name: string;
  type: 'REST' | 'GRAPHQL';
};

type Props = {
  title: string;
  owners: string[];
  schemas: Schemas[];
  // url of application
  updatedAt: string;
};

const MAX_LOADED = 2;

export const ApiDetailsCard = ({
  title,
  owners = [],
  schemas = [],
  updatedAt,
}: Props): JSX.Element => {
  const formatUpdatedAt = useCallback(
    (apiUpdatedAt: string) => `modified on: ${dayjs(apiUpdatedAt).format('DD MMM YYYY hh:mm a')}`,
    []
  );

  const stopOnClickPropogation: DOMAttributes<HTMLDivElement>['onClick'] = (event) => {
    event.stopPropagation();
  };

  return (
    <Card className="catalog-card-hover-effect cursor-pointer">
      <CardBody className="pf-u-px-md">
        <Stack hasGutter>
          <StackItem>
            <Split hasGutter className="pf-l-flex pf-m-align-items-flex-end">
              <SplitItem isFilled>
                <Title headingLevel="h4" size={TitleSizes['2xl']}>
                  {title}
                </Title>
              </SplitItem>
              <SplitItem>
                <Text component={TextVariants.small} className="pf-u-color-400">
                  {formatUpdatedAt(updatedAt)}
                </Text>
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem>
            <Split hasGutter>
              <SplitItem>
                <Split isWrappable onClick={stopOnClickPropogation}>
                  <SplitItem className="pf-u-mr-xs">
                    <Text>Owned by:</Text>
                  </SplitItem>
                  <ReadMore
                    limit={MAX_LOADED}
                    showMoreText={`+${(owners || []).length - MAX_LOADED} more`}
                  >
                    {owners.map((owner) => (
                      <SplitItem className="pf-u-ml-xs" key={owner}>
                        <Label isCompact color="cyan">
                          {owner}
                        </Label>
                      </SplitItem>
                    ))}
                  </ReadMore>
                </Split>
              </SplitItem>
              <SplitItem isFilled />
              <SplitItem>
                <Split onClick={stopOnClickPropogation} isWrappable>
                  <SplitItem className="pf-u-mr-sm">
                    <Text>Schema(s): </Text>
                  </SplitItem>
                  <ReadMore
                    limit={MAX_LOADED}
                    showMoreText={`+${(schemas || []).length - MAX_LOADED} more`}
                  >
                    {schemas.map(({ name, type }) => (
                      <SplitItem style={{ marginTop: '0.1rem' }} key={name}>
                        <Label
                          color="blue"
                          className="pf-u-mr-xs"
                          isCompact
                          icon={
                            <img
                              src={`${config.baseURL}images/${
                                type === 'REST' ? 'swagger-black-logo.svg' : 'graphql-logo.svg'
                              }`}
                              alt="api-type"
                              className="pf-u-mt-xs"
                              style={{ height: '0.8rem', width: '0.8rem' }}
                            />
                          }
                        >
                          {name}
                        </Label>
                      </SplitItem>
                    ))}
                  </ReadMore>
                </Split>
              </SplitItem>
            </Split>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};
