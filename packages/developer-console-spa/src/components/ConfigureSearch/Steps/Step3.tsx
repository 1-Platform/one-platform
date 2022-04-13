import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormSection,
  FormGroup,
  TextInput,
  Stack,
  StackItem,
  Grid,
  GridItem,
  Title,
  Form,
  ActionGroup,
  Button,
} from '@patternfly/react-core';
import { AppContext } from 'context/AppContext';
import { useStateMachine } from 'little-state-machine';
import { useCallback, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import saveState from './store';
import * as yup from 'yup';

type Step3 = Pick<App.SearchConfig, 'contentType' | 'fieldMap'>;

const formSchema = yup.object().shape({
  contentType: yup.string().required(),
  fieldMap: yup.object().shape({
    id: yup.string().required(),
    title: yup.string().required(),
    abstract: yup.string().required(),
  }),
});

export default function ConfigureSearchStep3({ onNext, onBack, onReset, nextButtonText }: IConfigureSearchStepProps) {
  const { appId } = useContext( AppContext );
  const { control, handleSubmit, formState: { errors, isValid } } = useForm<Step3>( {
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
  });

  const { actions, state } = useStateMachine({ nextStep: saveState });

  const formData = state.formData;

  const availableFields = [
    {
      label: 'id',
      isRequired: true,
      type: 'string',
      description: 'Unique identifier for the document being indexed',
    },
    {
      label: 'title',
      isRequired: true,
      type: 'string',
      description: 'Title of the document being indexed',
    },
    {
      label: 'abstract',
      isRequired: true,
      type: 'string',
      description: 'Abstract / short summary of the document being indexed',
    },
    {
      label: 'description',
      isRequired: false,
      type: 'string',
      description: 'Brief Description of the document being indexed',
    },
    {
      label: 'icon',
      isRequired: false,
      type: 'string/url',
      description: 'Icon for the document being indexed (optional for UI only)',
    },
    {
      label: 'uri',
      isRequired: false,
      type: 'string/url',
      description: 'The url related to the document being indexed',
    },
    {
      label: 'tags',
      isRequired: false,
      type: 'string/comma separated',
      description: 'Tags for the document being indexed',
    },
    {
      label: 'createdBy',
      isRequired: false,
      type: 'string/rhatUUID',
      description:
        'UserID (rhatUUID) of the creator/owner of the document being indexed',
    },
    {
      label: 'createdDate',
      isRequired: false,
      type: 'string/ISO timestamp',
      description: 'Timestamp for when the document was created',
    },
    {
      label: 'lastModifiedBy',
      isRequired: false,
      type: 'string/rhatUUID',
      description:
        'UserID (rhatUUID) of the user that last modified the document',
    },
    {
      label: 'lastModifiedDate',
      isRequired: false,
      type: 'string/ISO timestamp',
      description: 'Timestamp for when the document was last modified',
    },
  ];

  const saveAndNext = useCallback((data) => {
    actions.nextStep({
      formData: {
        ...state.formData,
        ...data,
      },
    });
    onNext?.();
  }, [actions, onNext, state.formData]);

  return (
    <Form onSubmit={handleSubmit(saveAndNext)}>
      <FormSection title="Step 3: Configure field mappings">
        <FormGroup
          isRequired
          fieldId="contentType"
          label="Content Type"
          helperText={`The Content Type where the data will be indexed as (default: ${appId})`}
          helperTextInvalid={errors.contentType?.message}
          validated={errors.contentType ? 'error' : 'default'}
        >
          <Controller
            name="contentType"
            control={control}
            defaultValue={formData?.contentType ?? ''}
            render={({ field }) => (
              <TextInput
                isRequired
                aria-label="Content Type"
                placeholder={appId}
                validated={errors.contentType ? 'error' : 'default'}
                {...field}
              />
            )}
          />
        </FormGroup>

        <FormGroup
          isRequired
          fieldId="fieldMap"
          label="Field Map"
          helperTextInvalid="Please provide the required field names"
          validated={errors.fieldMap ? 'error' : 'default'}
        >
          <Stack>
            <StackItem className="pf-u-background-color-200">
              <Grid span={6}>
                <GridItem>
                  <Title headingLevel="h4">
                    Search Index Field Name (Type)
                  </Title>
                </GridItem>
                <GridItem>
                  <Title headingLevel="h4">Your API Field name</Title>
                </GridItem>
              </Grid>
            </StackItem>

            {availableFields.map((fieldOption) => (
              <StackItem key={fieldOption.label}>
                <Grid span={6}>
                  <GridItem>
                    <label htmlFor={fieldOption.label}>
                      <strong>
                        <abbr title={fieldOption.description}>
                          {fieldOption.label}
                        </abbr>
                      </strong>
                      &nbsp;<small>({fieldOption.type})</small>
                      {fieldOption.isRequired && (
                        <span
                          className="pf-c-form__label-required"
                          aria-hidden="true"
                        >
                          *
                        </span>
                      )}
                    </label>
                  </GridItem>
                  <GridItem>
                    <Controller
                      control={control}
                      name={`fieldMap.${fieldOption.label}` as any}
                      defaultValue={
                        formData?.fieldMap?.[
                          fieldOption.label as keyof Search.FieldMap
                        ] ?? ''
                      }
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          id={fieldOption.label}
                          aria-label="Content Type"
                          isRequired={fieldOption.isRequired}
                          validated={
                            errors.fieldMap?.[
                              fieldOption.label as keyof Search.FieldMap
                            ]
                              ? 'error'
                              : 'default'
                          }
                          {...(!fieldOption.isRequired && {
                            placeholder: 'leave as empty if not required',
                          })}
                        />
                      )}
                    />
                  </GridItem>
                </Grid>
              </StackItem>
            ))}
          </Stack>
        </FormGroup>
      </FormSection>
      <ActionGroup>
        <Button variant="primary" type="submit" isDisabled={!isValid}>
          {nextButtonText ?? 'Next'}
        </Button>
        <Button variant="secondary" type="button" onClick={onBack}>
          Back
        </Button>
        <Button variant="plain" type="button" onClick={onReset}>
          Reset
        </Button>
      </ActionGroup>
    </Form>
  );
}
