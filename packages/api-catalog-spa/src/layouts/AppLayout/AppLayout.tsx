import { FC } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, Page, PageSection } from '@patternfly/react-core';
import { useBreadcrumb } from 'context/BreadcrumbContext';

import styles from './appLayout.module.scss';
import { Sidebar } from './components/Sidebar';

export const AppLayout: FC = () => {
  const { pathname } = useLocation();
  const { breadcrumbs } = useBreadcrumb();
  const isBreadcrumbHidden = breadcrumbs.length === 0;

  return (
    <Page
      mainContainerId="app-layout-page"
      sidebar={<Sidebar />}
      className={styles['app-layout']}
      breadcrumb={
        !isBreadcrumbHidden && (
          <Breadcrumb className={styles['app-layout--breadcrumb']}>
            <BreadcrumbItem to="/">One Platform</BreadcrumbItem>
            <BreadcrumbItem>
              {pathname === process.env.PUBLIC_URL ? (
                'API Catalog Home'
              ) : (
                <Link to="/">API Catalog</Link>
              )}
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
      <opc-footer theme="light" />
    </Page>
  );
};

export default AppLayout;
