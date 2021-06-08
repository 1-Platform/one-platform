import { Card, CardBody, Title } from '@patternfly/react-core';
import UnderDevelopment from './UnderDevelopment';

function ConfigureFeedback ( props: any ) {
  return (
    <>
      <Card isRounded>
        <CardBody>
          <Title headingLevel="h1">Configure Feedback</Title>
        </CardBody>
      </Card>

      <UnderDevelopment/>
    </>
  );
}

export default ConfigureFeedback;
