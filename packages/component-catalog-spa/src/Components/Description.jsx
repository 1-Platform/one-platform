import useFetchReadme from '../Hooks/useFetchReadme';
import { Spinner, HelperText, HelperTextItem } from '@patternfly/react-core';
import './Description.scss';

const Description = ({ componentLink }) => {
  const {data: readme, images, isPending, error} = useFetchReadme(componentLink);
  return (
    <>
    <div className="description">
    {error &&   
    <HelperText>
      <HelperTextItem variant="error"> { error } </HelperTextItem>
    </HelperText>}
    { isPending && <div className="spinner"><Spinner isSVG /></div> }
    {readme && 
    <>
    {images && images.map((image, index) => 
    <div>
      <img key={index} className="markdown-image" src={image.download_url} alt={image.download_url} />
    </div>)}
    <pfe-markdown class="no-reset-class">
      <div pfe-markdown-container="">
        { readme }
      </div>
    </pfe-markdown>
    </>
    }
    </div>
    </>
  );
};

export default Description;
