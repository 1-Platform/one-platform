import { Card, CardBody, Title } from '@patternfly/react-core';
import UnderDevelopment from './UnderDevelopment';

function ConfigureDatabase ( props: any ) {
  return (
    <>
      <Card isRounded>
        <CardBody>
          <Title headingLevel="h1">Configure Database</Title>
        </CardBody>
      </Card>

      <UnderDevelopment />
    </>
  );
}

export default ConfigureDatabase;
