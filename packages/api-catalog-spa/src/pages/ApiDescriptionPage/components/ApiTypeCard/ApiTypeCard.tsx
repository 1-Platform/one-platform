import {
  Card,
  CardBody,
  Split,
  Stack,
  StackItem,
  Text,
  Title,
  SplitItem,
  TextVariants,
} from '@patternfly/react-core';
import { ApiCategory } from 'graphql/namespace/types';
import { useCallback } from 'react';

interface Props {
  category?: ApiCategory;
}

export const ApiTypeCard = ({ category = ApiCategory.REST }: Props): JSX.Element => {
  const getApiTypeImage = useCallback(
    (apiCategory: ApiCategory) =>
      apiCategory === ApiCategory.REST
        ? `${process.env.PUBLIC_URL}/images/rest-logo.svg`
        : `${process.env.PUBLIC_URL}/images/graphql-logo.svg`,
    []
  );

  return (
    <Card className="catalog-card-flat">
      <CardBody>
        <Split className="pf-u-align-items-center">
          <SplitItem isFilled>
            <Stack>
              <StackItem className="pf-u-mb-xs">
                <Text component={TextVariants.small}>API Type</Text>
              </StackItem>
              <StackItem>
                <Title headingLevel="h6" size="2xl">
                  {category}
                </Title>
              </StackItem>
            </Stack>
          </SplitItem>
          <SplitItem>
            <img src={getApiTypeImage(category)} alt="api-type" />
          </SplitItem>
        </Split>
      </CardBody>
    </Card>
  );
};
