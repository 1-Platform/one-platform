import { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Button, Page, PageSection } from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons';
import { useToggle } from 'hooks';
import { useBreadcrumb } from 'context/BreadcrumbContext';
import { config } from 'config';

import styles from './appLayout.module.scss';
import { Sidebar } from './components/Sidebar';

export const AppLayout: FC = () => {
  const { pathname } = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useToggle(true);
  const { breadcrumbs } = useBreadcrumb();
  const isBreadcrumbHidden = breadcrumbs.length === 0;

  return (
    <Page
      mainContainerId="app-layout-page"
      sidebar={<Sidebar isOpen={isSidebarOpen} />}
      className={styles['app-layout']}
      breadcrumb={
        !isBreadcrumbHidden && (
          <Breadcrumb className={styles['app-layout--breadcrumb']}>
            <BreadcrumbItem>
              <Button variant="link" className="pf-u-p-0" onClick={setIsSidebarOpen.toggle}>
                <BarsIcon />
              </Button>
            </BreadcrumbItem>
            <BreadcrumbItem to="/">One Platform</BreadcrumbItem>
            <BreadcrumbItem>
              {pathname === config.baseURL ? 'API Catalog Home' : <Link to="/">API Catalog</Link>}
            </BreadcrumbItem>
            {breadcrumbs.map(({ label, url }, index) => {
              const isActive = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem key={label}>
                  {isActive ? label : <Link to={url}>{label}</Link>}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        )
      }
    >
      <PageSection
        className={styles['app-layout--content']}
        variant="light"
        padding={{ default: 'noPadding' }}
      >
        <Outlet />
      </PageSection>
    </Page>
  );
};

export default AppLayout;
