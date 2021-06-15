import { Card, CardBody, Title } from '@patternfly/react-core';
import UnderDevelopment from './UnderDevelopment';

function ConfigureSSI ( props: any ) {
  return (
    <>
      <Card isRounded>
        <CardBody>
          <Title headingLevel="h1">Configure SSI Header</Title>
        </CardBody>
      </Card>

      <UnderDevelopment />
    </>
  );
}

export default ConfigureSSI;
