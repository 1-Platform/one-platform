import useFetchReadme from '../Hooks/useFetchReadme';
import { 
  Spinner, 
  HelperText, 
  HelperTextItem,
  Brand, 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader, 
  CardHeaderMain, 
  CardTitle } from '@patternfly/react-core';
import './Description.scss';

const Description = ({ componentLink, githubLink, componentTitle }) => {
  const {data: readme, images, isPending, error} = useFetchReadme(componentLink);
  console.log(componentTitle);
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
      <Card>
        <CardHeader>
          <CardHeaderMain>
            <Brand src={'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'} alt="PatternFly logo" style={{ height: '50px' }} />
          </CardHeaderMain>
        </CardHeader>
        <CardTitle>
          <pfe-cta>
            <a target="_blank" href={githubLink } rel="noreferrer">Go to Github</a>
          </pfe-cta>
        </CardTitle>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default Description;
