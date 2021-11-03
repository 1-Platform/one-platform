import { Split, SplitItem, FormGroup, FormAlert, Alert } from '@patternfly/react-core';
import { Controller, useFormContext } from 'react-hook-form';
import { callbackify } from 'utils';
import { CatalogBigButton } from 'components/CatalogBigButton';
import { FormData } from '../../types';

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

export const ApiTypeSelector = (): JSX.Element => {
  const { control } = useFormContext<FormData>();

  return (
    <Controller
      control={control}
      name="category"
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => (
        <FormGroup fieldId="datasource-type" label="Datasource type" isRequired>
          <Split hasGutter>
            {apiOptions.map(({ title, desc, image, type }) => (
              <SplitItem isFilled key={type}>
                <CatalogBigButton
                  title={title}
                  desc={desc}
                  image={`${process.env.PUBLIC_URL}/images/${image}`}
                  isSelected={field.value === type}
                  onClick={callbackify(field.onChange, type)}
                />
              </SplitItem>
            ))}
          </Split>
          {error && (
            <FormAlert>
              <Alert variant="danger" title={error?.message} aria-live="polite" isInline />
            </FormAlert>
          )}
        </FormGroup>
      )}
    />
  );
};
