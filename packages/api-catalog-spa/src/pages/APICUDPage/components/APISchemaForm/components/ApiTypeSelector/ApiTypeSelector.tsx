import { Split, SplitItem, FormGroup, FormAlert, Alert } from '@patternfly/react-core';
import { callbackify } from 'utils';
import { CatalogBigButton } from 'components/CatalogBigButton';
import { ApiCategory } from 'api/types';
import { config } from 'config';

const apiOptions = [
  {
    title: 'REST',
    desc: 'Confirms to OpenAPI specs',
    image: 'rest-logo.svg',
    type: 'REST',
  },
  {
    title: 'GraphQL',
    desc: 'Query Language for your API',
    image: 'graphql-logo.svg',
    type: 'GRAPHQL',
  },
];

type Props = {
  value: ApiCategory;
  onChange: (...events: any[]) => void;
  errorMsg?: string;
};

export const ApiTypeSelector = ({ value, onChange, errorMsg }: Props): JSX.Element => {
  return (
    <FormGroup fieldId="datasource-type" label="Datasource type" isRequired>
      <Split hasGutter>
        {apiOptions.map(({ title, desc, image, type }) => (
          <SplitItem isFilled key={type}>
            <CatalogBigButton
              title={title}
              desc={desc}
              image={`${config.baseURL}images/${image}`}
              isSelected={value === type}
              onClick={callbackify(onChange, type)}
            />
          </SplitItem>
        ))}
      </Split>
      {errorMsg && (
        <FormAlert>
          <Alert variant="danger" title={errorMsg} aria-live="polite" isInline />
        </FormAlert>
      )}
    </FormGroup>
  );
};
