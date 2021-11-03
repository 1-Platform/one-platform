import { PageSection, Stack, StackItem, Text, Title, TitleSizes } from '@patternfly/react-core';

export const Header = (): JSX.Element => {
  return (
    <PageSection variant="light" isWidthLimited className="pf-m-align-center">
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2" size={TitleSizes['4xl']}>
            API Catalog
          </Title>
        </StackItem>
        <StackItem>
          <Text>
            A catalog of APIs to manage, promote and share APIs with developers and users.
          </Text>
        </StackItem>
      </Stack>
    </PageSection>
  );
};
