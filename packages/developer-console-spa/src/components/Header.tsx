import { Card, CardBody, Title } from '@patternfly/react-core';

function Header ( props: any ) {
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

export default Header;
