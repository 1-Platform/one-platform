import Main from '../Components/Main';
import { 
  Brand, 
  Card,
  CardFooter, 
  CardHeader, 
  Title, 
  Gallery, 
  GalleryItem, 
  Flex, 
  FlexItem,
} from '@patternfly/react-core';
import { Libraries } from '../Configs/component-libraries';

const Home = ({ components }) => {
  return <>
  <main>
    <h3>Components Catalog</h3>
    <p>
      A Unified interface to access components from Chapeaux, Patternfly
      elements and One Platform components, which allows in increase of
      collaboration and helps to improve component quality and development & 
      delivery speed.
    </p>
    <Main />
    <Gallery
    hasGutter
    minWidths={{
      default: '100%',
      sm: '50%',
      md: '33%',
      lg: '25%',
    }}>
    { components.map(
    ( component, index ) =>
    <GalleryItem key={ index}>
      <Card isFullHeight isRounded>
        <CardHeader>
          <Flex 
            alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem>
                <Brand src={Libraries.find(lib => lib.shortName === component.name.split('-')[0]).logo} alt="logo" style={{ height: '48px' }} />
            </FlexItem>
            <FlexItem >
              <Title className="pf-u-ml-md" headingLevel="h2">{component.title}</Title>
            </FlexItem>
          </Flex>
        </CardHeader>
        <CardFooter>
          <a target="_blank" className="anchor-link" rel="noreferrer" href={component.html_url}>
            View on Github
            <ion-icon style={{marginBottom: '-2px', marginLeft: '.25rem'}} name="arrow-forward-outline"></ion-icon>
          </a>
        </CardFooter>
      </Card> 
    </GalleryItem>) }
    </Gallery>
  </main>
  </>
  };

export default Home;
