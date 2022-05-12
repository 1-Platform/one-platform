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
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';

import { callbackify } from 'utils';
import { FormData } from 'pages/APICUDPage/APICUDPage.types';

import styles from './headerForm.module.scss';

type Props = {
  schemaPos: number;
  envPos: number;
};

export const EnvHeaderFormSection = ({ schemaPos, envPos }: Props): JSX.Element => {
  const { control, watch } = useFormContext<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schemas.${schemaPos}.environments.${envPos}.headers`,
  });
  const headerFields = watch(`schemas.${schemaPos}.environments.${envPos}.headers`);

  const handleRemoveHeader = (indexToRemove: number) => {
    remove(indexToRemove);
  };

  return (
    <Stack hasGutter>
      <StackItem style={{ marginBottom: 0 }}>
        <Split>
          <SplitItem isFilled>
            <p className="pf-u-font-weight-bold" style={{ marginBottom: '-1rem' }}>
              Headers
            </p>
          </SplitItem>
          <SplitItem>
            <Button
              icon={<PlusIcon />}
              variant="link"
              isSmall
              className="pf-u-mb-xs"
              onClick={() => append({ id: undefined, value: '', key: '' })}
            >
              Add Header
            </Button>
          </SplitItem>
        </Split>
      </StackItem>
      {fields.map((field, index) => (
        <StackItem key={field.id}>
          <Split hasGutter>
            <SplitItem isFilled>
              <Controller
                name={`schemas.${schemaPos}.environments.${envPos}.headers.${index}.key`}
                control={control}
                defaultValue=""
                render={({ field: controllerField, fieldState: { error } }) => (
                  <FormGroup
                    fieldId={`headers.${index}.key`}
                    isRequired
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextInput
                      aria-label="header name"
                      placeholder="Content-Type"
                      {...controllerField}
                    />
                  </FormGroup>
                )}
              />
            </SplitItem>
            <SplitItem isFilled>
              <Controller
                name={`schemas.${schemaPos}.environments.${envPos}.headers.${index}.value`}
                control={control}
                defaultValue=""
                render={({ field: controllerField, fieldState: { error } }) => (
                  <FormGroup
                    fieldId={`headers.${index}.value`}
                    isRequired
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextInput
                      aria-label="header url"
                      isDisabled={Boolean(headerFields?.[index].id)}
                      placeholder="**********"
                      type="password"
                      {...controllerField}
                    />
                  </FormGroup>
                )}
              />
            </SplitItem>
            <SplitItem>
              <Button
                variant="secondary"
                onClick={callbackify(handleRemoveHeader, index)}
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
