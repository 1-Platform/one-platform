import { forwardRef } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Checkbox,
  FormGroup,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@patternfly/react-icons';
import { ApiCategory } from 'api/types';
import { FormData, HandleSchemaValidationArg } from 'pages/APICUDPage/APICUDPage.types';
import { UseGetAPISchemaFileQuery } from 'pages/APICUDPage/hooks/types';

import { ApiTypeSelector } from './components/ApiTypeSelector';
import { EnvironmentFormSection } from './components/EnvironmentFormSection';

interface Props {
  handleSchemaValidation: (
    arg0: HandleSchemaValidationArg
  ) => Promise<UseGetAPISchemaFileQuery['fetchAPISchema'] | undefined>;
  isUpdate?: boolean;
}

export const APISchemaForm = forwardRef<HTMLDivElement, Props>(
  ({ handleSchemaValidation, isUpdate }: Props, ref): JSX.Element => {
    const { control } = useFormContext<FormData>();
    const { append, fields, remove } = useFieldArray({
      control,
      name: 'schemas',
    });

    const onAppendSchema = () => {
      append({
        appURL: '',
        description: '',
        docURL: '',
        environments: [
          {
            apiBasePath: '',
            headers: [{ key: 'Content-Type', value: 'application/json', id: undefined }],
            isPublic: false,
            name: '',
            schemaEndpoint: '',
            slug: '',
            id: undefined,
          },
        ],
      });
    };

    const onRemoveSchema = (index: number) => {
      remove(index);
    };

    return (
      <Stack hasGutter ref={ref}>
        {fields.map(({ id }, index) => (
          <StackItem key={id}>
            <Card>
              <CardTitle>
                <Split>
                  <SplitItem isFilled>
                    <Title headingLevel="h2">API Schema #{index + 1}</Title>
                  </SplitItem>
                  <SplitItem>
                    <Button
                      variant="secondary"
                      aria-label="Remove"
                      onClick={() => onRemoveSchema(index)}
                      className="trash-button"
                    >
                      <TrashIcon />
                    </Button>
                  </SplitItem>
                </Split>
              </CardTitle>
              <CardBody>
                <Stack hasGutter>
                  <StackItem>
                    <Controller
                      control={control}
                      name={`schemas.${index}.name`}
                      defaultValue=""
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          label="Schema Name"
                          isRequired
                          fieldId="api-schema-name"
                          validated={error ? 'error' : 'success'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            id="api-schema-name"
                            placeholder="Enter schema name"
                            {...field}
                          />
                        </FormGroup>
                      )}
                    />
                  </StackItem>
                  <StackItem>
                    <Controller
                      control={control}
                      name={`schemas.${index}.description`}
                      defaultValue=""
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          label="Description"
                          isRequired
                          fieldId="api-schema-name"
                          validated={error ? 'error' : 'success'}
                          helperTextInvalid={error?.message}
                        >
                          <TextArea
                            isRequired
                            id="api-source-name"
                            placeholder="Give a name for the API datasource"
                            {...field}
                          />
                        </FormGroup>
                      )}
                    />
                  </StackItem>
                  <StackItem>
                    <Controller
                      control={control}
                      name={`schemas.${index}.category`}
                      render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <ApiTypeSelector
                          value={value as ApiCategory}
                          onChange={onChange}
                          errorMsg={error?.message}
                        />
                      )}
                    />
                  </StackItem>
                  <StackItem>
                    <Controller
                      name={`schemas.${index}.flags.isInternal`}
                      defaultValue={false}
                      render={({ field }) => (
                        <Checkbox
                          label="Is this API for internal users only?"
                          description="Tick this option if this particular API is designed to be used only Red Hat internally"
                          isChecked={field.value}
                          id={`api-schema-${index}-internal-flag`}
                          {...field}
                        />
                      )}
                    />
                  </StackItem>
                  <StackItem>
                    <Split hasGutter>
                      <SplitItem isFilled>
                        <Controller
                          control={control}
                          name={`schemas.${index}.appURL`}
                          defaultValue=""
                          render={({ field, fieldState: { error } }) => (
                            <FormGroup
                              label="Application URL"
                              isRequired
                              fieldId={`schemas.${index}.appUrl`}
                              validated={error ? 'error' : 'success'}
                              helperTextInvalid={error?.message}
                            >
                              <TextInput
                                isRequired
                                id={`schemas.${index}.appUrl`}
                                placeholder="Enter the URL of the App"
                                {...field}
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                      <SplitItem isFilled>
                        <Controller
                          control={control}
                          name={`schemas.${index}.docURL`}
                          defaultValue=""
                          render={({ field, fieldState: { error } }) => (
                            <FormGroup
                              label="Documentation URL"
                              fieldId={`schemas.${index}.docURL`}
                              validated={error ? 'error' : 'success'}
                              helperTextInvalid={error?.message}
                            >
                              <TextInput
                                isRequired
                                id={`schemas.${index}.docURL`}
                                placeholder="Enter the URL of API documentaiton"
                                {...field}
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                    </Split>
                  </StackItem>
                  {isUpdate && (
                    <StackItem>
                      <Controller
                        name={`schemas.${index}.flags.isDeprecated`}
                        defaultValue={false}
                        render={({ field }) => (
                          <Checkbox
                            label="Is this API deprecated?"
                            isChecked={field.value}
                            id={`api-schema-${index}-deprecated-flag`}
                            {...field}
                          />
                        )}
                      />
                    </StackItem>
                  )}
                  <StackItem>
                    <EnvironmentFormSection
                      schemaPos={index}
                      handleSchemaValidation={handleSchemaValidation}
                    />
                  </StackItem>
                  {index === fields.length - 1 && (
                    <StackItem>
                      <Button icon={<PlusIcon />} iconPosition="left" onClick={onAppendSchema}>
                        Add Schema
                      </Button>
                    </StackItem>
                  )}
                </Stack>
              </CardBody>
            </Card>
          </StackItem>
        ))}
      </Stack>
    );
  }
);
