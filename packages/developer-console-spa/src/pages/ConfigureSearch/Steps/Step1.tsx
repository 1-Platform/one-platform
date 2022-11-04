import { yupResolver } from '@hookform/resolvers/yup';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { ActionGroup, Button, Form, FormGroup, FormSection, FormSelect, FormSelectOption, Grid, GridItem, TextInput } from '@patternfly/react-core';
import { useStateMachine } from 'little-state-machine';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import saveState from './store';
import * as yup from 'yup';

type Step1 = Pick<Project.SearchConfig, 'method' | 'apiUrl' | 'body'>

const formSchema = yup.object().shape( {
  method: yup.string().required(),
  apiUrl: yup.string()
    .url( 'API URL must be a valid url' )
    .required( 'API URL is mandatory' ),
  body: yup.string(),
});

export default function ConfigureSearchStep1 ( { onNext, onReset }: IConfigureSearchStepProps ) {
  const { control, handleSubmit, watch, formState: { errors, isValid } } = useForm<Step1>( {
    mode: 'onBlur',
    resolver: yupResolver(formSchema),
  });
  const { actions, state } = useStateMachine( { nextStep: saveState } );

  const formData = state.formData;

  const method = watch('method');
  const httpMethods = [
    { label: 'GET', value: 'GET', isDisabled: false },
    { label: 'POST', value: 'POST', isDisabled: false },
  ];

  const isRequestBodyVisible = method
    ? method === 'POST'
    : formData.method === 'POST';

  const saveAndNext = useCallback( ( data ) => {
    actions.nextStep( {
      formData: {
        ...state.formData,
        ...data
      }
    } );
    onNext?.();
  }, [actions, onNext, state.formData] );

  return (
    <Form onSubmit={handleSubmit(saveAndNext)}>
      <FormSection title="Step 1: Setup API Endpoint">
        <FormGroup
          fieldId="apiUri"
          label="API Endpoint"
          helperText="The API Endpoint where the data can be found"
          helperTextInvalid={ errors.apiUrl?.message }
          validated={ errors.apiUrl ? 'error' : 'default' }
          isRequired
        >
          <Grid>
            <GridItem span={2}>
              <Controller
                name="method"
                control={control}
                defaultValue={formData?.method}
                render={({ field }) => (
                  <FormSelect aria-label="API mode" {...field}>
                    {httpMethods.map((method) => (
                      <FormSelectOption key={method.label} {...method} />
                    ))}
                  </FormSelect>
                )}
              />
            </GridItem>
            <GridItem span={10}>
              <Controller
                name="apiUrl"
                control={control}
                defaultValue={formData?.apiUrl ?? ''}
                render={({ field }) => (
                  <TextInput
                    id="apiUri"
                    aria-label="API URI"
                    placeholder="https://example.com/api/"
                    {...field}
                  />
                )}
              />
            </GridItem>
          </Grid>
        </FormGroup>

        {isRequestBodyVisible && (
          <FormGroup
            isRequired
            fieldId="body"
            label="Request Body"
            helperText="The JSON body for the post request"
          >
            <Controller
              name="body"
              control={control}
              defaultValue={formData?.body}
              render={({ field }) => (
                <CodeEditor
                  isLineNumbersVisible={true}
                  isMinimapVisible={true}
                  code={field.value}
                  {...field}
                  language={Language.json}
                  wrap={''}
                  options={{ tabSize: 2 }}
                  height="10rem"
                />
              )}
            />
          </FormGroup>
        )}
      </FormSection>

      <ActionGroup>
        <Button variant="primary" type="submit" isDisabled={!isValid}>
          Next
        </Button>
        <Button variant="plain" type="button" onClick={onReset}>
          Reset
        </Button>
      </ActionGroup>
    </Form>
  );
}
