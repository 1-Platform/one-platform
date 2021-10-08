import './Main.scss';
import { 
  Brand, 
  Card, CardBody, CardFooter, CardHeader, Title, Gallery, GalleryItem, Flex, FlexItem } from '@patternfly/react-core';
import { Libraries } from '../assets/component-libraries';

const Main = () => {
    return (
        <Gallery className="main"
        hasGutter
        minWidths={{
          default: '100%',
          sm: '50%',
          md: '33%',
          lg: '25%',
        }}>
        { Libraries.map(
          ( lib ) => 
          <GalleryItem>
            <Card key={ lib.id } isFullHeight isRounded>
            <CardHeader>
              <Flex 
              hasGutter
              alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                    <Brand src={lib.logo} alt="logo" style={{ height: '48px' }} />
                </FlexItem>
                <FlexItem isFilled>
                  <Title className="pf-u-ml-md" headingLevel="h2">{lib.title}</Title>
                </FlexItem>
              </Flex>
            </CardHeader>
            <CardBody isFilled>{lib.description}</CardBody>
            <CardFooter>
              <a target="_blank" rel="noreferrer" href={lib.link}>
                View on Github
                <ion-icon style={{marginBottom: '-2px', marginLeft: '.25rem'}} name="arrow-forward-outline"></ion-icon>
              </a>
            </CardFooter>
          </Card> 
        </GalleryItem>
        ) }
        </Gallery>
    );
}

export default Main;
