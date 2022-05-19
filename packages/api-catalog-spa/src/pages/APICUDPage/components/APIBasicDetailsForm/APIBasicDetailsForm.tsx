import { forwardRef } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  SelectOptionObject,
  SelectVariant,
  Stack,
  StackItem,
  TextArea,
  TextInput,
  Title,
} from '@patternfly/react-core';
import { Controller, useFormContext } from 'react-hook-form';
import { ApiEmailGroup } from 'api/types';
import { FormData } from 'pages/APICUDPage/APICUDPage.types';
import { AsyncSelect } from 'components';
import { debouncePromise } from 'utils';

type Props = {
  onSearchOwners: (value: string) => Promise<JSX.Element[]>;
};

export const APIBasicDetailsForm = forwardRef<HTMLDivElement, Props>(
  ({ onSearchOwners }: Props, ref): JSX.Element => {
    const { control, trigger } = useFormContext<FormData>();

    // PFE select selected value could be either string or object
    // Object when its a select from the list of provided
    // String when creating or deleting
    const onSelectOwner = (
      onChange: (...event: any[]) => void,
      value: FormData['owners'],
      selected: string | SelectOptionObject,
      isPlaceholder?: boolean
    ) => {
      if (isPlaceholder) return;

      const isSelectedString = typeof selected === 'string';
      const id =
        typeof selected === 'string' ? selected : (selected as { rhatUUID: string }).rhatUUID;
      const isSelected = value.findIndex(({ mid, email }) => mid === id || email === id) !== -1;

      if (isSelected) {
        onChange(value.filter(({ mid, email }) => mid !== id && email !== id));
      } else if (isSelectedString) {
        onChange([...value, { group: ApiEmailGroup.MAILING_LIST, mid: selected, email: selected }]);
      } else {
        onChange([
          ...value,
          { group: ApiEmailGroup.USER, mid: id, email: (selected as { mail: string }).mail },
        ]);
      }
      // What it does: This triggers a validation on owner field after onChange
      // Why: when react hook form in blur validation mode. The multi select has a text field and a selected view component
      // On clicking select onblur is triggered before onchange on select view causing the validtion to fail
      // thus onchange i trigger validation again
      trigger('owners', { shouldFocus: false });
    };

    return (
      <Card ref={ref}>
        <CardTitle>
          <Title headingLevel="h1">Add API to Catalog</Title>
        </CardTitle>
        <CardBody>
          <Stack hasGutter>
            <StackItem>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <FormGroup
                    label="API Source name"
                    fieldId="api-source-name"
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextInput
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
                name="description"
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <FormGroup
                    label="Description"
                    fieldId="api-desc-name"
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <TextArea
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
                name="owners"
                defaultValue={[]}
                render={({ field: { onChange, value, onBlur, name }, fieldState: { error } }) => (
                  <FormGroup
                    label="Owners"
                    fieldId="api-owners"
                    validated={error ? 'error' : 'success'}
                    helperTextInvalid={error?.message}
                  >
                    <AsyncSelect
                      render={debouncePromise(onSearchOwners)}
                      variant={SelectVariant.typeaheadMulti}
                      isCreatable
                      // onCreateOption={(mid) =>
                      //   onChange([...value, { group: ApiEmailGroup.MAILING_LIST, mid, email: mid }])
                      // }
                      onSelect={(_, selected, isPlaceholder) =>
                        onSelectOwner(onChange, value, selected, isPlaceholder)
                      }
                      name={name}
                      onBlur={onBlur}
                      selections={value.map(({ email }) => email)}
                      createText="Use mailing list: "
                      placeholderText="Search by kerberos id or add mailing list"
                      customFilter={() => true}
                      maxHeight="320px"
                    />
                  </FormGroup>
                )}
              />
            </StackItem>
          </Stack>
        </CardBody>
      </Card>
    );
  }
);
