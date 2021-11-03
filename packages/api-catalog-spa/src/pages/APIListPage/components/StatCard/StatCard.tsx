import {
  Spinner,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import { ReactNode } from 'react';

import styles from './statCard.module.scss';

interface Props {
  // stat type
  category: string;
  children: ReactNode;
  isLoading?: boolean;
  isSelected?: boolean;
  // stat score
  value?: number;
  onClick?: () => void;
}

export const StatCard = ({
  category,
  children,
  isLoading,
  isSelected,
  value,
  onClick,
}: Props): JSX.Element => {
  const onStatCardClick: React.KeyboardEventHandler = (e) => {
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Spacebar') {
      if (onClick) onClick();
    }
  };

  return (
    <div
      className={css(styles['stat-card'], isSelected && styles['stat-card-selected'])}
      onClick={onClick}
      role="button"
      aria-pressed="false"
      onKeyPress={onStatCardClick}
      tabIndex={0}
    >
      <Split>
        <SplitItem isFilled className="pf-l-flex pf-m-align-items-center">
          {children}
        </SplitItem>
        <SplitItem>
          <Stack className="pf-u-text-align-right">
            <StackItem>
              <Text component={TextVariants.h3} className="pf-u-font-size-xl">
                {category}
              </Text>
            </StackItem>
            <StackItem>
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <Text component={TextVariants.small}>Total: {value}</Text>
              )}
            </StackItem>
          </Stack>
        </SplitItem>
      </Split>
    </div>
  );
};
