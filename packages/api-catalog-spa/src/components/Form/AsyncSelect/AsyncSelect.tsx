import { useMemo } from 'react';
import { Select, SelectOption, SelectProps } from '@patternfly/react-core';
import { Control, useController } from 'react-hook-form';
import { debounce } from 'utils/debounce';

interface Props<T> {
  typeAheadValue: string;
  control: Control;
  // the key to which
  objectKey: keyof T;
  data: T[];
  isLoading: boolean;
  onTypeaheadInputChanged: (value: string) => void;
}

export const AsyncSelect = <T extends Record<string, unknown>>({
  name,
  typeAheadValue,
  control,
  objectKey,
  data,
  isLoading,
  onTypeaheadInputChanged,
  ...selectProps
}: Props<T> & SelectProps): JSX.Element => {
  const { field } = useController({
    control,
    name: name as string,
  });

  const options = useMemo(() => {
    if (!typeAheadValue || isLoading) return [];

    return data.map((dataField, index) => {
      const optionValue = { ...dataField, toString: dataField[objectKey] };
      return (
        <SelectOption key={`${dataField[objectKey]}-owner-${index + 1}`} value={optionValue} />
      );
    });
  }, [data, typeAheadValue, isLoading, objectKey]);

  return (
    <Select
      {...selectProps}
      name={name}
      selections={field.value.map((fieldData: T) => fieldData[objectKey])}
      onTypeaheadInputChanged={debounce(onTypeaheadInputChanged)}
      loadingVariant={isLoading ? 'spinner' : undefined}
      onFilter={() => options}
      maxHeight="45vh"
      noResultsFoundText={typeAheadValue ? 'No result found' : 'Type to load'}
    >
      {options}
    </Select>
  );
};
