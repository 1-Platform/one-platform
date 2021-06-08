import { Card, CardBody, EmptyState, EmptyStateIcon, Title } from '@patternfly/react-core';

export default function UnderDevelopment () {
  return (
    <Card isPlain>
      <CardBody>
        <EmptyState>
          <EmptyStateIcon
            variant="container"
            component={
              () => <ion-icon name="construct-outline" size="large"></ion-icon>
            } />
          <Title headingLevel="h2">Under Development</Title>
        </EmptyState>
      </CardBody>
    </Card>
  );
}
