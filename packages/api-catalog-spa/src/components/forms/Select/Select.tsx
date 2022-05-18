import { SelectProps, Select as PfeSelect } from '@patternfly/react-core';
import { useToggle } from 'hooks';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
} & Omit<SelectProps, 'onToggle' | 'isOpen'>;

export const Select = ({ children, onSelect, ...selectProps }: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useToggle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPfeSelect = (...args: any) => {
    // eslint-disable-next-line prefer-spread
    onSelect?.apply(null, args);
    setIsOpen.off();
  };

  return (
    <PfeSelect {...selectProps} onSelect={onPfeSelect} isOpen={isOpen} onToggle={setIsOpen.toggle}>
      {children}
    </PfeSelect>
  );
};
