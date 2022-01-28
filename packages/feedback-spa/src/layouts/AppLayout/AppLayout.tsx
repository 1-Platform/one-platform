import { Outlet } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Page, Stack, StackItem, Title } from '@patternfly/react-core';

export const AppLayout = (): JSX.Element => {
  return (
    <Page>
      <div style={{ border: '1px solid #ddd' }}>
        <Stack>
          <StackItem className="p-4">
            <Title headingLevel="h1" size="2xl">
              Feedback
            </Title>
          </StackItem>
          <StackItem className="p-4">
            <Breadcrumb>
              <BreadcrumbItem to="/">One Platform</BreadcrumbItem>
              <BreadcrumbItem to="#" isActive>
                All Feedback
              </BreadcrumbItem>
            </Breadcrumb>
          </StackItem>
        </Stack>
      </div>
      <Outlet />
    </Page>
  );
};
