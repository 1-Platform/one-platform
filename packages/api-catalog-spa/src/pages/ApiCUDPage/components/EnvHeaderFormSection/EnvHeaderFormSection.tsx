import { useFormContext, useFieldArray, Controller } from 'react-hook-form';

import {
  Button,
  FormGroup,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';
import { TrashIcon } from '@patternfly/react-icons';

import { callbackify } from 'utils';
import { FormData } from '../../types';

import styles from './headerForm.module.scss';

export const EnvHeaderFormSection = (): JSX.Element => {
  const { control } = useFormContext<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'headers',
  });

  const handleInputClick = (isLastInput: boolean) => {
    if (isLastInput) append({ key: '', value: '' }, { shouldFocus: false });
  };

  const handleRemoveHeader = (hasOnlyOneHeaderInput: boolean, indexToRemove: number) => {
    if (!hasOnlyOneHeaderInput) remove(indexToRemove);
  };

  return (
    <Stack hasGutter>
      <StackItem className="pf-u-pb-xs">
        <p className="pf-u-font-weight-bold" style={{ marginBottom: '-1rem' }}>
          Headers
        </p>
      </StackItem>
      {fields.map((field, index) => (
        <StackItem key={field.id}>
          <Split hasGutter>
            <SplitItem isFilled>
              <Controller
                name={`headers.${index}.key`}
                control={control}
                defaultValue={field.key}
                render={({ field: controllerField, fieldState: { error } }) => (
                  <FormGroup
                    fieldId={`headers.${index}.key`}
                    isRequired
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextInput
                      aria-label="header name"
                      placeholder="Key"
                      {...controllerField}
                      onClick={callbackify(handleInputClick, index + 1 === fields.length)}
                    />
                  </FormGroup>
                )}
              />
            </SplitItem>
            <SplitItem isFilled>
              <Controller
                name={`headers.${index}.value`}
                control={control}
                defaultValue={field.value}
                render={({ field: controllerField, fieldState: { error } }) => (
                  <FormGroup
                    fieldId={`headers.${index}.value`}
                    isRequired
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextInput aria-label="header url" placeholder="value" {...controllerField} />
                  </FormGroup>
                )}
              />
            </SplitItem>
            <SplitItem>
              <Button
                variant="secondary"
                onClick={callbackify(handleRemoveHeader, fields.length === 1, index)}
                className={styles['trash-button']}
              >
                <TrashIcon />
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      ))}
    </Stack>
  );
};
