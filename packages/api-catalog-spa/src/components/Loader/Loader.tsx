import { EmptyState, EmptyStateIcon, Spinner, Text } from '@patternfly/react-core';
import { FC } from 'react';

export const Loader: FC  = () => {
  return (
    <EmptyState>
      <EmptyStateIcon
        variant="container"
        component={ Spinner }
      ></EmptyStateIcon>
      <Text>Loading...</Text>
    </EmptyState>
  );
}
