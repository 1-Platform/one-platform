export enum ApiCatalogLinks {
  HomePage = '/',
  ListPage = '/apis',
  AddNewApiPage = '/apis/new',
  ApiDescriptionPage = '/apis/:id',
  ApiEditPage = '/apis/:id/edit',
  SwaggerPage = '/apis/rest/swagger/:id',
  VoyagerPage = 'apis/graphql/voyager/:id',
  Playground = 'apis/graphql/playground/:id',
}

export const apiToolsLinks = [
  ApiCatalogLinks.Playground,
  ApiCatalogLinks.VoyagerPage,
  ApiCatalogLinks.SwaggerPage,
];
