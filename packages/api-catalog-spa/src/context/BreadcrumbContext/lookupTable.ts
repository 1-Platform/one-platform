import { ApiCatalogLinks } from 'router/links';
import { Breadcrumb } from './types';

export const LOOK_UP_TABLE: Record<string, Breadcrumb> = {
  root: {
    label: 'One Platform',
    url: '/',
  },
  exploreApi: {
    label: 'Explore APIs',
    url: '/apis',
  },
  newApi: {
    label: 'New',
    url: '/apis/new',
  },
  edit: {
    label: 'Edit',
    url: '/apis/edit/:slug',
  },
  swagger: {
    label: 'Swagger Toolbox',
    url: '/',
  },
  redoc: {
    label: 'Redoc Toolbox',
    url: '/',
  },
  gqlPlayground: {
    label: 'GraphQL Playground',
    url: '/',
  },
};

export const BREADCRUMB_USERFLOW: Record<string, string[]> = {
  [ApiCatalogLinks.ListPage]: ['exploreApi'],
  [ApiCatalogLinks.AddNewApiPage]: ['exploreApi', 'newApi'],
  [ApiCatalogLinks.ApiEditPage]: ['exploreApi', 'api-name', 'edit'],
  [ApiCatalogLinks.APIDescriptionPage]: ['exploreApi', 'api-name'],
  [ApiCatalogLinks.SwaggerPage]: ['exploreApi', 'swagger'],
  [ApiCatalogLinks.Playground]: ['exploreApi', 'gqlPlayground'],
  [ApiCatalogLinks.RedocPage]: ['exploreApi', 'redoc'],
};
