import { ReactNode } from 'react';
import { Button, Text, TextProps } from '@patternfly/react-core';
import { useToggle } from 'hooks';

interface Props {
  children: ReactNode;
  component?: ReactNode;
  limit?: number;
}

export const ReadMore = ({
  children,
  component,
  limit = 300,
  ...props
}: Props & TextProps): JSX.Element => {
  const [isReadMore, setReadMore] = useToggle(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = component || Text;
  const text = children;

  if (typeof text !== 'string') {
    throw Error('String required');
  }

  const isReadMoreHidden = text.length <= limit;

  return (
    <Component {...props}>
      {isReadMore ? text.slice(0, limit) : text}
      {!isReadMoreHidden && (
        <>
          {isReadMore && '... '}
          <Button onClick={setReadMore.toggle} variant="link" isInline>
            {isReadMore ? 'Read more' : ' Show less'}
          </Button>
        </>
      )}
    </Component>
  );
};
