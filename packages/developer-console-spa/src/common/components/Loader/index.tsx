import { EmptyState, EmptyStateIcon, Spinner, Text } from '@patternfly/react-core';

export default function Loader () {
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
