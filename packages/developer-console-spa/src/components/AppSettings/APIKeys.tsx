import { Card, CardBody } from '@patternfly/react-core';
import UnderDevelopment from 'components/UnderDevelopment';

interface IAPIKeyProps {
  app: any
}

export default function APIKeys ( prop: IAPIKeyProps ) {
  return (
    <>
      <Card isRounded>
        <CardBody>
          <UnderDevelopment/>
        </CardBody>
      </Card>
    </>
  )
}
