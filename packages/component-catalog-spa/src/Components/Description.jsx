import useFetchReadme from '../Hooks/useFetchReadme';
import { 
  Spinner, 
  HelperText, 
  HelperTextItem,
  Brand, 
  Card, 
  CardFooter,
  Flex,
  FlexItem,
  Title,
  CardHeader, 
  CardHeaderMain,
} from '@patternfly/react-core';
import './Description.scss';
import { Libraries } from '../Configs/component-libraries';

const Description = ({ component }) => {
  const {data: readme, images, isPending, error} = useFetchReadme(component.url);
  return (
    <div className="description">
      <div className="description__content">
        {error &&   
        <HelperText>
          <HelperTextItem variant="error"> { error } </HelperTextItem>
        </HelperText>}
        { isPending && <div className="spinner"><Spinner isSVG /></div> }
        {readme && 
        <>
        {images && images.map((image, index) => 
        <div key={index} >
          <img className="markdown-image" src={image.download_url} alt={image.download_url} />
        </div>)}
        <pfe-markdown>
          <div pfe-markdown-container="">
            { readme }
          </div>
        </pfe-markdown>
        </>
        }
      </div>
      <div className="description__cards">
      { component.name.split('-')[1] && 
        <Card>
          <CardHeader>
            <CardHeaderMain>
              <Flex 
                alignItems={{ default: 'alignItemsCenter' }}>
                <FlexItem>
                    <Brand src={Libraries.find(lib => lib.shortName === component.name.split('-')[0]).logo} alt="logo" style={{ height: '48px' }} />
                </FlexItem>
                <FlexItem className="capitalize">
                  <Title className="pf-u-ml-md" headingLevel="h2">{component.title}</Title>
                </FlexItem>
              </Flex>
            </CardHeaderMain>
          </CardHeader>
          <CardFooter>
            <a target="_blank" className="anchor-link" rel="noreferrer" href={component.html_url}>
              View on Github
              <ion-icon style={{marginBottom: '-2px', marginLeft: '.25rem'}} name="arrow-forward-outline"></ion-icon>
            </a>
          </CardFooter>
        </Card>
      }
      </div>
    </div>
  );
};

export default Description;
