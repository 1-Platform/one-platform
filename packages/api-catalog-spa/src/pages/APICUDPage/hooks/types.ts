import { ApiEmailGroup, ApiCategory, ApiSchema, Header } from 'api/types';

export type CreateNamespaceType = {
  name: string;
  description: string;
  owners: Array<{ group: ApiEmailGroup; mid: string }>;
  schemas: CreateNamespaceSchemaType[];
};

export type CreateNamespaceSchemaType = {
  name: string;
  description: string;
  appURL: string;
  docURL?: string;
  category: ApiCategory;
  flags: {
    isInternal: boolean;
    isDeprecated: boolean;
  };
  environments: CreateNamespaceEnvType[];
};

export type CreateNamespaceEnvType = {
  name: string;
  apiBasePath: string;
  schemaEndpoint?: string;
  headers: Array<{ key: string; value: string }>;
  isPublic: boolean;
};

export type UseGetAPISchemaFileQuery = {
  fetchAPISchema: {
    schema: Pick<ApiSchema, 'name' | 'id'>;
    file: string;
  };
};

export type UseGetAPISchemaFileVariable = {
  config: {
    category?: ApiCategory;
    schemaEndpoint?: String;
    headers?: Header[];
  };
  envSlug?: string;
};
