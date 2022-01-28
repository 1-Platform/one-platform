import { Button, Split, SplitItem, Title, TitleSizes } from '@patternfly/react-core';

interface Props {
  title: string;
  onClear: () => void;
  isClearable?: boolean;
}

export const FilterTitle = ({ title, onClear, isClearable }: Props): JSX.Element => {
  return (
    <Split style={{ alignItems: 'center' }}>
      <SplitItem isFilled>
        <Title headingLevel="h6" size={TitleSizes.xl}>
          {title}
        </Title>
      </SplitItem>
      {isClearable && (
        <SplitItem>
          <Button variant="plain" style={{ fontSize: '14px' }} onClick={onClear}>
            clear
          </Button>
        </SplitItem>
      )}
    </Split>
  );
};

FilterTitle.defaultProps = {
  isClearable: false,
};
