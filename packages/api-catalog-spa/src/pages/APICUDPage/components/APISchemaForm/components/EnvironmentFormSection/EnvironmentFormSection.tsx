/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Checkbox,
  FormGroup,
  Grid,
  GridItem,
  SelectOption,
  SelectVariant,
  Stack,
  StackItem,
  TextInput,
} from '@patternfly/react-core';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import { Controller, useFormContext, useFieldArray } from 'react-hook-form';
import { Select } from 'components';
import { ApiCategory, Header } from 'api/types';

import { callbackify, isValidURL } from 'utils';
import { FormData, HandleSchemaValidationArg } from 'pages/APICUDPage/APICUDPage.types';
import { UseGetAPISchemaFileQuery } from 'pages/APICUDPage/hooks/types';

import { EnvHeaderFormSection } from './components/EnvHeaderFormSection';
import { EnvSchemaField } from './components/EnvSchemaField';

import styles from './environmentFormSection.module.scss';

type Props = {
  schemaPos: number;
  handleSchemaValidation: (
    arg0: HandleSchemaValidationArg
  ) => Promise<UseGetAPISchemaFileQuery['fetchAPISchema'] | undefined>;
};

type ApiEnvironmentType = FormData['schemas'][0]['environments'][0];

export const EnvironmentFormSection = ({
  schemaPos,
  handleSchemaValidation,
}: Props): JSX.Element => {
  const [envNames, setEnvNames] = useState(['prod', 'stage', 'qa', 'dev']);
  const { control, watch, getValues, setError, clearErrors, setValue } = useFormContext<FormData>();
  const isGraphqlAPI = watch(`schemas.${schemaPos}.category`) === ApiCategory.GRAPHQL;
  const { fields, append, remove } = useFieldArray({
    control,
    name: `schemas.${schemaPos}.environments`,
  });

  const handleAddNewEnvironment = () => {
    append(
      {
        name: '',
        apiBasePath: '',
        headers: [{ key: '', value: '', id: undefined }],
        schemaEndpoint: '',
        isPublic: false,
      },
      { shouldFocus: false }
    );
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

  const onSetIntrospectionQuery = (envIndex: number) => {
    const selectedEnv = `schemas.${schemaPos}.environments.${envIndex}` as const;
    const value = getValues(selectedEnv);
    setValue(`schemas.${schemaPos}.environments.${envIndex}.schemaEndpoint`, value.apiBasePath);
  };

  const setSchemaEndpointIsInvalid = (envIndex: number) => {
    setError(`schemas.${schemaPos}.environments.${envIndex}.schemaEndpoint`, {
      type: 'custom',
      message: `Failed to get ${isGraphqlAPI ? 'introspection url' : 'api schema'}`,
    });
  };

  const handleSchemaVerification = async (envIndex: number, schemaURL: string) => {
    if (!schemaURL) return;
    const isURL = isValidURL(schemaURL);
    const selectedEnv = `schemas.${schemaPos}.environments.${envIndex}` as const;
    if (isURL) {
      const envData = getValues(selectedEnv) as ApiEnvironmentType;
      const { slug, schemaEndpoint } = envData;
      const category = isGraphqlAPI ? ApiCategory.GRAPHQL : ApiCategory.REST;
      const headers = (envData?.headers || []).filter(({ key, value }) => key && value) as Header[];

      const data = await handleSchemaValidation({
        headers,
        schemaEndpoint,
        envSlug: slug,
        category,
      });
      if (!data?.file) {
        setSchemaEndpointIsInvalid(envIndex);
      } else {
        clearErrors(`schemas.${schemaPos}.environments.${envIndex}.schemaEndpoint`);
      }
    } else {
      setSchemaEndpointIsInvalid(envIndex);
      window.OpNotification.danger({ subject: 'Invalid schema url provided' });
    }
  };

  return (
    <Stack hasGutter className="pf-u-mt-md">
      <StackItem>
        <p className="pf-u-font-weight-bold">Environments</p>
      </StackItem>
      <StackItem>
        <Stack hasGutter>
          {fields.map((field, index) => (
            <StackItem key={field.id}>
              <Card id={field.id}>
                <CardBody>
                  <Grid hasGutter>
                    <GridItem span={3}>
                      <Controller
                        name={`schemas.${schemaPos}.environments.${index}.name`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field: controllerField, fieldState: { error } }) => (
                          <FormGroup
                            fieldId={`schemas.${schemaPos}.environments.${index}.name`}
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
                              placeholder="Enter environment name"
                              isCreatable
                              onCreateOption={onEnvNameCreate}
                              placeholderText="Enter environment name"
                            >
                              {envNames.map((env, envIndex) => (
                                <SelectOption key={`${env}-${envIndex + 1}`} value={env} />
                              ))}
                            </Select>
                          </FormGroup>
                        )}
                      />
                    </GridItem>
                    <GridItem span={8}>
                      <Controller
                        name={`schemas.${schemaPos}.environments.${index}.apiBasePath`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field: controllerField, fieldState: { error } }) => (
                          <FormGroup
                            fieldId={`schemas.${schemaPos}.environments.${index}.apiBasePath`}
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
                    <GridItem
                      span={1}
                      className="pf-u-display-flex pf-u-justify-content-center pf-u-align-items-flex-end"
                    >
                      <Button
                        variant="secondary"
                        aria-label="Remove"
                        onClick={callbackify(remove, index)}
                        className={styles['trash-button']}
                      >
                        <TrashIcon />
                      </Button>
                    </GridItem>
                    <GridItem span={12}>
                      <Controller
                        name={`schemas.${schemaPos}.environments.${index}.schemaEndpoint`}
                        control={control}
                        rules={{ required: true }}
                        defaultValue=""
                        render={({ field: { ...controllerField }, fieldState: { error } }) => (
                          <EnvSchemaField
                            isGraphqlAPI={isGraphqlAPI}
                            isError={Boolean(error)}
                            errorMessage={error?.message}
                            envIndex={index}
                            onCopyValue={() => onSetIntrospectionQuery(index)}
                            onRedoValidation={() =>
                              handleSchemaVerification(index, controllerField.value || '')
                            }
                            {...controllerField}
                          />
                        )}
                      />
                    </GridItem>
                    <GridItem span={12}>
                      <EnvHeaderFormSection schemaPos={schemaPos} envPos={index} />
                    </GridItem>
                    <GridItem span={12}>
                      <Controller
                        name={`schemas.${schemaPos}.environments.${index}.isPublic`}
                        defaultValue={false}
                        render={({ field: controllerField }) => (
                          <Checkbox
                            label="Is this API accessible from public?"
                            description="Tick this option if your environment can be accessed without VPN"
                            isChecked={controllerField.value}
                            id={`api-schema-${schemaPos}-env-${index}-internal`}
                            {...controllerField}
                          />
                        )}
                      />
                    </GridItem>
                  </Grid>
                </CardBody>
              </Card>
            </StackItem>
          ))}
        </Stack>
      </StackItem>
      <StackItem>
        <Button
          variant="link"
          icon={<PlusIcon size="sm" />}
          className="pf-u-p-0 pf-u-mb-lg"
          onClick={handleAddNewEnvironment}
        >
          Add Environment
        </Button>
      </StackItem>
    </Stack>
  );
};
