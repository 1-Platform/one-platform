import { Card, CardBody, Title } from '@patternfly/react-core';

interface IHeaderProps {
  title: string
}

export default function Header ( props: IHeaderProps ) {
  return (
    <>
      <header>
        <Card isRounded>
          <CardBody>
            <Title headingLevel="h1">{ props.title }</Title>
          </CardBody>
        </Card>
      </header>
    </>
  );
}
