import { yupResolver } from '@hookform/resolvers/yup';
import { ActionGroup, BadgeToggle, Button, Dropdown, DropdownItem, Form, FormGroup, FormSection, FormSelect, FormSelectOption, Grid, GridItem, Stack, StackItem, TextInput } from '@patternfly/react-core';
import { useStateMachine } from 'little-state-machine';
import { isEmpty } from 'lodash';
import { useCallback, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import saveState from './store';

type Step2 = Pick<Project.SearchConfig, 'authorization' | 'apiHeaders'>;

const formSchema = yup.object().shape({
  authorization: yup.object().shape( {
    location: yup.string(),
    authType: yup.string(),
    credentials: yup.string(),
    key: yup.string(),
  } ),
  apiHeaders: yup.array( yup.object().shape( {
    key: yup.string().required(),
    value: yup.string().required(),
  } ) ),
});

export default function ConfigureSearchStep2 ( { onNext, onBack, onReset }: IConfigureSearchStepProps ) {
  const { control, handleSubmit, setValue, getValues, formState: { isValid } } = useForm<Step2>( {
    mode: 'onBlur',
    resolver: yupResolver( formSchema ),
  } );
  const headers = useFieldArray({
    control,
    name: 'apiHeaders',
  } );

  const { actions, state } = useStateMachine({ nextStep: saveState });

  const formData = state.formData;

  const authLocations = [ 'header' ];
  const authTypes = ['Basic', 'Bearer', 'apikey'];

  const [isOpenAuthLocationDropdown, setIsOpenAuthLocationDrowdown] = useState(false);

  const toggleAuthLocationDropdown = useCallback(
    (force = false) => {
      setIsOpenAuthLocationDrowdown(!isOpenAuthLocationDropdown && force);
    },
    [isOpenAuthLocationDropdown]
  );

  const selectAuthLocation = useCallback(
    ({ target }) => {
      setValue('authorization.location', target.dataset.value);
      toggleAuthLocationDropdown(true);
    },
    [setValue, toggleAuthLocationDropdown]
  );

  const saveAndNext = useCallback((data: Step2) => {
    if ( !isEmpty( data.authorization ) ) {
      data.authorization.key = 'Authorization';
    }

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
      <FormSection title="Step 2: Auth and other headers">
        <FormGroup
          fieldId="apiAuthCredentials"
          label="Authorization"
          helperText="If the API is authenticated, provide the authorization details"
          labelIcon={
            <Controller
              name="authorization.location"
              control={control}
              defaultValue={
                formData?.authorization?.location || (authLocations[0] as any)
              }
              render={({ field }) => (
                <Dropdown
                  isOpen={isOpenAuthLocationDropdown}
                  onSelect={(event) => selectAuthLocation(event)}
                  toggle={
                    <BadgeToggle
                      id="toggle-id"
                      onToggle={toggleAuthLocationDropdown}
                    >
                      {getValues('authorization.location')}
                    </BadgeToggle>
                  }
                  dropdownItems={authLocations.map((location) => (
                    <DropdownItem key={location} data-value={location}>
                      {location}
                    </DropdownItem>
                  ))}
                />
              )}
            />
          }
        >
          <Grid>
            <GridItem span={2}>
              <Controller
                name="authorization.authType"
                control={control}
                defaultValue={formData?.authorization?.authType ?? authTypes[0]}
                render={({ field }) => (
                  <FormSelect
                    id="apiAuthType"
                    {...field}
                    aria-label="Authorization Type"
                  >
                    {authTypes.map((authType) => (
                      <FormSelectOption
                        key={authType}
                        value={authType}
                        label={authType}
                      />
                    ))}
                  </FormSelect>
                )}
              />
            </GridItem>
            <GridItem span={10}>
              <Controller
                name="authorization.credentials"
                control={control}
                defaultValue={formData?.authorization?.credentials}
                render={({ field }) => (
                  <TextInput
                    id="apiAuthCredentials"
                    aria-label="Authorization Credentials"
                    placeholder="auth_token"
                    type="password"
                    {...field}
                  />
                )}
              />
            </GridItem>
          </Grid>
        </FormGroup>

        <FormGroup
          fieldId="apiHeaders"
          label="Headers"
          helperText="Custom Headers that should be passed to the API Endpoint"
          labelIcon={
            <Controller
              name="authorization.location"
              control={control}
              defaultValue={formData?.authorization?.location}
              render={({ field }) => (
                <Button
                  variant="link"
                  isInline
                  onClick={() => headers.append({ key: '', value: '' })}
                >
                  <ion-icon name="add-circle-outline"></ion-icon>
                  &nbsp;Add
                </Button>
              )}
            />
          }
        >
          <Stack>
            {headers.fields.map(({ id }, index) => (
              <StackItem key={id}>
                <Grid>
                  <GridItem span={4}>
                    <Controller
                      control={control}
                      name={`apiHeaders.${index}.key` as const}
                      defaultValue={
                        (formData?.apiHeaders?.[index]?.key as any) || ''
                      }
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          aria-label="Header Key"
                          placeholder="header"
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem span={7}>
                    <Controller
                      control={control}
                      name={`apiHeaders.${index}.value` as const}
                      defaultValue={
                        (formData?.apiHeaders?.[index]?.value as any) ?? ''
                      }
                      render={({ field }) => (
                        <TextInput
                          {...field}
                          aria-label="Header Value"
                          placeholder="value"
                        />
                      )}
                    />
                  </GridItem>
                  <GridItem span={1}>
                    <Button
                      variant="link"
                      isDanger
                      onClick={() => headers.remove(index)}
                    >
                      <ion-icon name="remove-circle-outline"></ion-icon>
                    </Button>
                  </GridItem>
                </Grid>
              </StackItem>
            ))}
          </Stack>
        </FormGroup>
      </FormSection>
      <ActionGroup>
        <Button variant="primary" type="submit" isDisabled={!isValid}>
          Next
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
