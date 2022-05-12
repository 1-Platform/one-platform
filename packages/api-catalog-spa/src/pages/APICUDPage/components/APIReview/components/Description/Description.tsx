import { Text, Stack, StackItem } from '@patternfly/react-core';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
  isRequired?: boolean;
}

export const Description = ({ children, title, isRequired }: Props): JSX.Element => {
  return (
    <Stack>
      <StackItem className="pf-u-mb-xs">
        <Text component="small" className="pf-u-color-400">
          {title}
          {isRequired && <sup> *</sup>}
        </Text>
      </StackItem>
      <StackItem>{children}</StackItem>
    </Stack>
  );
};
