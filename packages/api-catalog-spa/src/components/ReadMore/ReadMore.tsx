import { Fragment, ReactNode } from 'react';
import { Button, TextProps } from '@patternfly/react-core';
import { useToggle } from 'hooks';

interface Props {
  children: ReactNode;
  component?: ReactNode;
  limit?: number;
  showMoreText?: string;
  showLessText?: string;
}

export const ReadMore = ({
  children,
  component,
  limit = 300,
  showMoreText = '... Read more',
  showLessText = 'Show less',
  ...props
}: Props & TextProps): JSX.Element => {
  const [isReadMore, setReadMore] = useToggle(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component: any = component || Fragment;
  const text = children;

  if (typeof text !== 'string' && !Array.isArray(text)) {
    throw Error('String required');
  }

  const isReadMoreHidden = text.length <= limit;

  return (
    <Component {...props}>
      {isReadMore ? text.slice(0, limit) : text}
      {!isReadMoreHidden && (
        <Button
          onClick={setReadMore.toggle}
          variant="link"
          isInline
          className="pf-u-ml-sm pf-u-font-size-sm"
        >
          {isReadMore ? showMoreText : showLessText}
        </Button>
      )}
    </Component>
  );
};
