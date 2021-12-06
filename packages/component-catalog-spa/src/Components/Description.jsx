import useFetchReadme from '../Hooks/useFetchReadme';
import { Spinner, HelperText, HelperTextItem } from '@patternfly/react-core';

const Description = ({ componentLink }) => {
  const {data: readme, images, isPending, error} = useFetchReadme(componentLink);
  return (
    <>
    <div className="description">
    {error &&   
    <HelperText>
      <HelperTextItem variant="error"> { error } </HelperTextItem>
    </HelperText>}
    { isPending && <Spinner isSVG /> }
    {readme && 
    <>
    <img src={images[0].download_url } alt={'text'} />
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
