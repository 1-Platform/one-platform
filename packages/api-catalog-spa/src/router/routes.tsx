import { lazy } from 'react';
import { AppLayout } from 'layouts/AppLayout';

const SwaggerToolboxPage = lazy(() => import('../pages/SwaggerToolboxPage'));
const RedocToolboxPage = lazy(() => import('../pages/RedocToolboxPage'));
const GQLPlaygroundToolboxPage = lazy(() => import('../pages/GQLPlaygroundToolboxPage'));
const APIListPage = lazy(() => import('../pages/APIListPage'));
const ApiCUDPage = lazy(() => import('../pages/APICUDPage'));
const APIDescriptionPage = lazy(() => import('../pages/APIDescriptionPage'));
const HomePage = lazy(() => import('../pages/HomePage'));

export const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        key: 'home',
      },
      {
        path: '/apis',
        element: <APIListPage />,
        key: 'api-list',
      },
      {
        path: '/apis/new',
        element: <ApiCUDPage />,
        key: 'api-create',
      },
      {
        path: '/apis/edit/:slug',
        element: <ApiCUDPage />,
        key: 'api-update-delete',
      },
      {
        path: '/apis/:slug',
        element: <APIDescriptionPage />,
        key: 'api-details',
      },
      {
        path: '/apis/rest/swagger/:envSlug',
        element: <SwaggerToolboxPage />,
        key: 'api-swagger',
      },
      {
        path: '/apis/rest/redoc/:envSlug',
        element: <RedocToolboxPage />,
        key: 'api-redoc',
      },
      {
        path: '/apis/graphql/playground/:envSlug',
        element: <GQLPlaygroundToolboxPage />,
        key: 'api-gql-playground',
      },
    ],
  },
];
