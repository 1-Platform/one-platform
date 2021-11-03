/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardTitle,
  FormGroup,
  Grid,
  GridItem,
  SelectOption,
  SelectVariant,
  TextInput,
} from '@patternfly/react-core';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Select } from 'components/Select';

import { callbackify } from 'utils';
import { FormData } from '../../types';

export const EnvironmentFormSection = (): JSX.Element => {
  const [envNames, setEnvNames] = useState(['prod', 'stage', 'qa', 'dev']);
  const { control } = useFormContext<FormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'environments',
  });

  const handleAddNewEnvironment = () => {
    append({ name: '', apiBasePath: '' });
  };

  const onEnvNameClear = (onChange: (...event: any[]) => void) => {
    onChange('');
  };

  const onEnvNameSelect = (
    onChange: (...event: any[]) => void,
    event: React.MouseEventHandler,
    selection: string,
    isPlaceholder: boolean
  ) => {
    if (isPlaceholder) onEnvNameClear(onChange);
    else {
      onChange(selection);
    }
  };

  const onEnvNameCreate = (newSelection: string) => {
    if (envNames.findIndex((envName) => envName === newSelection) === -1) {
      setEnvNames((envState) => [...envState, newSelection]);
    }
  };

  return (
    <>
      <p className="pf-u-font-weight-bold" style={{ marginBottom: '-1rem' }}>
        Environments
      </p>
      {fields.map((field, index) => (
        <Card key={field.id} id={field.id}>
          <CardHeader
            toggleButtonProps={{
              'aria-label': 'Details',
              'aria-labelledby': 'titleId toggle-button',
            }}
          >
            <CardActions>
              <Button variant="plain" aria-label="Remove" onClick={callbackify(remove, index)}>
                <TrashIcon />
              </Button>
            </CardActions>
            <CardTitle>
              <Grid hasGutter>
                <GridItem span={3}>
                  <Controller
                    name={`environments.${index}.name`}
                    control={control}
                    rules={{ required: true }}
                    defaultValue={field.name}
                    render={({ field: controllerField, fieldState: { error } }) => (
                      <FormGroup
                        fieldId={`environments.${index}.name`}
                        label="Name"
                        isRequired
                        validated={error ? 'error' : 'success'}
                        helperTextInvalid={error?.message}
                      >
                        <Select
                          variant={SelectVariant.typeahead}
                          typeAheadAriaLabel="Select a state"
                          onSelect={callbackify(onEnvNameSelect, controllerField.onChange)}
                          onClear={callbackify(onEnvNameClear, controllerField.onChange)}
                          selections={controllerField.value}
                          aria-label="env link"
                          placeholder="Enter env name"
                          isCreatable
                          onCreateOption={onEnvNameCreate}
                        >
                          {envNames.map((env, envIndex) => (
                            <SelectOption key={`${env}-${envIndex + 1}`} value={env} />
                          ))}
                        </Select>
                      </FormGroup>
                    )}
                  />
                </GridItem>
                <GridItem span={9}>
                  <Controller
                    name={`environments.${index}.apiBasePath`}
                    control={control}
                    rules={{ required: true }}
                    defaultValue={field.apiBasePath}
                    render={({ field: controllerField, fieldState: { error } }) => (
                      <FormGroup
                        fieldId={`environments.${index}.apiBasePath`}
                        label="API Base Path"
                        isRequired
                        validated={error ? 'error' : 'success'}
                        helperTextInvalid={error?.message}
                      >
                        <TextInput
                          aria-label="env link"
                          placeholder="Enter base path for the api"
                          {...controllerField}
                        />
                      </FormGroup>
                    )}
                  />
                </GridItem>
              </Grid>
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
      <div>
        <Button
          variant="link"
          icon={<PlusIcon size="sm" />}
          className="pf-u-p-0"
          onClick={handleAddNewEnvironment}
        >
          Add new environment
        </Button>
      </div>
    </>
  );
};
