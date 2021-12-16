import './Main.scss';
import { 
  Brand, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  Title, 
  Gallery, 
  GalleryItem, 
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { Libraries } from '../Configs/component-libraries';

const Main = () => {
  return (
    <>
    <Gallery
    hasGutter
    minWidths={{
      default: '100%',
      sm: '50%',
      md: '33%',
      lg: '25%',
    }}>
    { Libraries.map(
      ( lib ) => 
    <GalleryItem key={ lib.id }>
      <Card isFullHeight isRounded>
        <CardHeader>
          <Flex 
            alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
                <Brand src={lib.logo} alt="logo" style={{ height: '48px' }} />
            </FlexItem>
            <FlexItem >
              <Title className="pf-u-ml-md" headingLevel="h2">{lib.title}</Title>
            </FlexItem>
          </Flex>
        </CardHeader>
        <CardBody >{lib.description}</CardBody>
        <CardFooter>
          <Flex
          alignItems={ { default: 'justifyContentSpaceBetween'} }>
            <FlexItem>
              <a target="_blank" className="anchor-link" rel="noreferrer" href={lib.link}>
              View on Github
              <ion-icon style={{marginBottom: '-2px', marginLeft: '.25rem'}} name="arrow-forward-outline"></ion-icon>
            </a>
            </FlexItem>
            <FlexItem>
              <a className="anchor-link" href={`mailto:${lib.email}`}> <ion-icon name="mail-outline"></ion-icon></a>
            </FlexItem>
          </Flex>
        </CardFooter>
      </Card> 
    </GalleryItem>
    ) }
    </Gallery>
    </>
  );
}

export default Main;
