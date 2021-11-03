import { AppLayout } from 'layouts/AppLayout';
import { lazy } from 'react';

const SwaggerToolPage = lazy(() => import('pages/SwaggerToolPage'));
const VoyagerToolPage = lazy(() => import('pages/VoyagerToolPage'));
const GqlPlaygroundPage = lazy(() => import('pages/GqlPlaygroundPage'));
const APIListPage = lazy(() => import('pages/APIListPage'));
const ApiCUDPage = lazy(() => import('pages/ApiCUDPage'));
const ApiDescriptionPage = lazy(() => import('pages/ApiDescriptionPage'));
const HomePage = lazy(() => import('pages/HomePage'));

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
        key: 'list',
      },
      {
        path: '/apis/new',
        element: <ApiCUDPage />,
        key: 'new',
      },
      {
        path: '/apis/:id/edit',
        element: <ApiCUDPage />,
        key: 'edit',
      },
      {
        path: 'apis/:id',
        element: <ApiDescriptionPage />,
        key: 'detail',
      },
      {
        path: 'apis/rest/swagger/:id',
        element: <SwaggerToolPage />,
        key: 'swagger',
      },
      {
        path: 'apis/graphql/voyager/:id',
        element: <VoyagerToolPage />,
        key: 'voyager',
      },
      {
        path: 'apis/graphql/playground/:id',
        element: <GqlPlaygroundPage />,
        key: 'playground',
      },
    ],
  },
];
