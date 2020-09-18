import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStatePrimary,
  Title,
} from '@patternfly/react-core';
import { BreadcrumbContext } from '../context/BreadcrumbContext';

function NotFound () {
  const { updateCrumbs } = useContext( BreadcrumbContext );

  useEffect( () => {
    updateCrumbs( [
      { name: '404', href: window.location.href }
    ] );

    return () => updateCrumbs( [] );
  }, [ ] );

  return (
    <EmptyState variant="xl" isFullHeight>
      <EmptyStateIcon
        variant="container"
        component={() => <ion-icon name="trail-sign-outline"></ion-icon>}
      ></EmptyStateIcon>
      <Title size="2xl" headingLevel="h2">
        Page Not Found
      </Title>
      <EmptyStatePrimary>
        <Button
          variant="link"
          component={ Link }
          to="/"
          icon={ <ion-icon name="arrow-back-outline"></ion-icon> }
        >
          User Group Home
        </Button>
      </EmptyStatePrimary>
    </EmptyState>
  );
}

export default NotFound;
