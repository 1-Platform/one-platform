interface Props {
  children: JSX.Element;
  isWrapped: boolean;
  wrapper: (child: JSX.Element) => JSX.Element;
}

export const ConditionalWrapper = ({ isWrapped, wrapper, children }: Props) =>
  isWrapped ? wrapper(children) : children;
