import { EmptyState, EmptyStateIcon, Spinner, Text } from '@patternfly/react-core';

export const Loader = (): JSX.Element => {
  return (
    <EmptyState>
      <EmptyStateIcon variant="container" component={Spinner} />
      <Text>Loading...</Text>
    </EmptyState>
  );
};
