import { ReactNode, useCallback } from 'react';
import dayjs from 'dayjs';
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
} from '@patternfly/react-core';

interface Props {
  title: string;
  ownedBy: string;
  // url of application
  appUrl: string;
  updatedAt: string;
  children: ReactNode;
  apiType: 'REST' | 'GRAPHQL';
}

export const ApiDetailsCard = ({
  title,
  ownedBy,
  appUrl,
  updatedAt,
  children,
  apiType,
}: Props): JSX.Element => {
  const formatUpdatedAt = useCallback(
    (apiUpdatedAt: string) => `modified on: ${dayjs(apiUpdatedAt).format('DD MMM YYYY hh:mm a')}`,
    []
  );

  const isRestApiType = apiType === 'REST';

  return (
    <Card className="catalog-card-hover-effect cursor-pointer">
      <CardBody>
        <Stack hasGutter>
          <StackItem>
            <Stack>
              <StackItem>
                <Split hasGutter className="pf-l-flex pf-m-align-items-center">
                  <SplitItem isFilled>
                    <Title headingLevel="h4" size={TitleSizes['2xl']}>
                      {title}
                    </Title>
                  </SplitItem>
                  <SplitItem>
                    <Text component={TextVariants.small}>{formatUpdatedAt(updatedAt)}</Text>
                  </SplitItem>
                  <SplitItem className="pf-l-flex pf-m-align-items-center">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${
                        isRestApiType ? 'rest-logo.svg' : 'graphql-logo.svg'
                      }`}
                      alt="api-type"
                      style={{ height: '2rem', maxWidth: '2.5rem' }}
                    />
                  </SplitItem>
                </Split>
              </StackItem>
              <StackItem>
                <Text>{`Owned by: ${ownedBy}`}</Text>
              </StackItem>
            </Stack>
          </StackItem>
          <StackItem>
            <Split hasGutter>
              <SplitItem isFilled>
                <Text>
                  URL:{' '}
                  <a
                    href={appUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{ textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {appUrl}
                  </a>
                </Text>
              </SplitItem>
              <SplitItem className="pf-l-flex pf-m-align-items-center">{children}</SplitItem>
            </Split>
          </StackItem>
        </Stack>
      </CardBody>
    </Card>
  );
};
