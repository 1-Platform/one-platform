import { ReactNode } from 'react';
import {
  Card,
  CardBody,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  Title,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

interface Props {
  onClick?: () => void;
  isSelected?: boolean;
  isFlat?: boolean;
  image: string;
  title: string;
  desc: string;
  rightIcon?: ReactNode;
}

export const CatalogBigButton = ({
  onClick,
  isSelected,
  isFlat,
  image,
  title,
  desc,
  rightIcon,
}: Props): JSX.Element => {
  return (
    <Card
      className={css(
        'cursor-pointer',
        isFlat ? 'catalog-card-flat' : 'catalog-card-hover-effect',
        isSelected && 'catalog-card-select-effect'
      )}
      style={{ minWidth: '275px' }}
      onClick={onClick}
    >
      <CardBody>
        <Split hasGutter>
          <SplitItem className="pf-l-flex pf-m-align-items-center">
            <img src={image} alt="catalog button logo" style={{ width: '2.5rem' }} />
          </SplitItem>
          <SplitItem isFilled>
            <Stack>
              <StackItem>
                <Split>
                  <SplitItem className="pf-u-mr-sm">
                    <Title headingLevel="h4">{title}</Title>
                  </SplitItem>
                  <SplitItem>{rightIcon}</SplitItem>
                </Split>
              </StackItem>
              <StackItem>
                <Text component={TextVariants.small} className="pf-u-color-400">
                  {desc}
                </Text>
              </StackItem>
            </Stack>
          </SplitItem>
        </Split>
      </CardBody>
    </Card>
  );
};
