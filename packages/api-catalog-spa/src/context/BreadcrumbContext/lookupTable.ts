import { ApiCatalogLinks } from 'router';
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
    url: '/apis/:id/edit',
  },
};

export const BREADCRUMB_USERFLOW: Record<string, string[]> = {
  [ApiCatalogLinks.ListPage]: ['exploreApi'],
  [ApiCatalogLinks.AddNewApiPage]: ['exploreApi', 'newApi'],
  [ApiCatalogLinks.ApiEditPage]: ['exploreApi', 'api-name', 'edit'],
  [ApiCatalogLinks.ApiDescriptionPage]: ['exploreApi', 'api-name'],
};
