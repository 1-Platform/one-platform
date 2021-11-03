import { ApiCategory, ApiEmailGroup } from 'graphql/namespace/types';

export type FormData = {
  name: string;
  description: string;
  appUrl: string;
  environments: Environments[];
  headers: Headers[];
  category: ApiCategory;
  owners: ApiOwner[];
  schemaEndpoint: string;
};

export type ApiOwner = {
  group: ApiEmailGroup;
  mid: string;
  email: string;
};

export type Environments = {
  name: string;
  apiBasePath: string;
};

export type Headers = {
  key: string;
  value: string;
};
