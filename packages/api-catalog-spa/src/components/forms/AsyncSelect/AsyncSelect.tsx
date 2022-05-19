/* eslint-disable no-nested-ternary */
import { ChangeEvent, JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { SelectProps, Select as PfeSelect, SelectOption } from '@patternfly/react-core';
import { useToggle } from 'hooks';

type Props = {
  render: (value: string) => Promise<JSX.Element[]>;
  customFilter?: (child: JSX.Element) => boolean;
} & Omit<SelectProps, 'onToggle' | 'isOpen'>;

const LOADING = [<SelectOption key="option-loading" value="Loading..." isPlaceholder isDisabled />];

export const AsyncSelect = ({
  render,
  onSelect,
  customFilter,
  onTypeaheadInputChanged,
  ...selectProps
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useToggle();
  const [options, setOptions] = useState<ReactElement<any, string | JSXElementConstructor<any>>[]>(
    []
  );

  const [typeAhead, setTypeAhead] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTypeAhead('');
      setOptions([]);
      return;
    }

    setOptions(LOADING);
    render(typeAhead)
      .then((loadedOptions) => {
        setOptions(loadedOptions);
      })
      .catch(() => {
        setOptions([
          <SelectOption
            key="option-error"
            value="Failed to fetch request"
            isPlaceholder
            isDisabled
          />,
        ]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeAhead, isOpen]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPfeSelect = (...args: any) => {
    // eslint-disable-next-line prefer-spread
    onSelect?.apply(null, args);
    setIsOpen.off();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPfeTypeAheadChange = (value: string) => {
    setTypeAhead(value);
    // eslint-disable-next-line prefer-spread
    if (onTypeaheadInputChanged) onTypeaheadInputChanged(value);
  };

  const onFilter = (a: ChangeEvent<HTMLInputElement> | null, value: string) => {
    if (!value) {
      return options;
    }

    if (!customFilter) return options;

    return options.filter((child) => customFilter(child));
  };

  return (
    <PfeSelect
      {...selectProps}
      onSelect={onPfeSelect}
      isOpen={isOpen}
      onToggle={setIsOpen.toggle}
      onTypeaheadInputChanged={onPfeTypeAheadChange}
      onFilter={customFilter && onFilter}
    >
      {options}
    </PfeSelect>
  );
};
