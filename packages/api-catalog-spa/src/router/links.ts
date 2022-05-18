export enum ApiCatalogLinks {
  HomePage = '/',
  ListPage = '/apis',
  AddNewApiPage = '/apis/new',
  APIDescriptionPage = '/apis/:slug',
  ApiEditPage = '/apis/edit/:slug',
  SwaggerPage = '/apis/rest/swagger/:envSlug',
  RedocPage = '/apis/rest/redoc/:envSlug',
  VoyagerPage = 'apis/graphql/voyager/:envSlug',
  Playground = 'apis/graphql/playground/:envSlug',
}

export const apiToolsLinks = [
  ApiCatalogLinks.Playground,
  ApiCatalogLinks.VoyagerPage,
  ApiCatalogLinks.SwaggerPage,
];
