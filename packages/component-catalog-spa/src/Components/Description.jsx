import useFetchReadme from '../Hooks/useFetchReadme';
import { Spinner, HelperText, HelperTextItem } from '@patternfly/react-core';
import './Description.scss';

const Description = ({ componentLink, githubLink }) => {
  const {data: readme, images, isPending, error} = useFetchReadme(componentLink);
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
        <pfe-cta>
          <a target="_blank" href={githubLink } rel="noreferrer">Go to Github</a>
        </pfe-cta>
        <pfe-markdown>
          <div pfe-markdown-container="">
            { readme }
          </div>
        </pfe-markdown>
        </>
        }
      </div>
      <div className="description__cards">
        Testing
      </div>
    </div>
  );
};

export default Description;
