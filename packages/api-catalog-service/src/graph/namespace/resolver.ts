/* eslint-disable no-underscore-dangle */
import { IExecutableSchemaDefinition } from '@graphql-tools/schema';
import { fetchSchema, validateSpecSheet } from 'specsheet';

import {
  ApiOwnerType,
  CreateNamespaceInputArgs,
  FetchSchemaArgs,
  GetCMDBCodeListArg,
  GetNamespaceCountArgs,
  ListNamespaceArg,
  UpdateNamespaceArgs,
} from '../types';

const NamespaceResolver: IExecutableSchemaDefinition<IContext>['resolvers'] = {
  NamespaceSortType: {
    CREATED_ON: 'createdOn',
    UPDATED_ON: 'updatedOn',
    NAME: 'name',
  },
  NamespaceSortDir: {
    ASC: 1,
    DESC: -1,
  },
  ApiOwnerType: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj: ApiOwnerType) {
      if (obj.group === 'USER') {
        return 'OwnerUserType';
      }
      return 'OwnerMailingType';
    },
  },
  OwnerMailingType: {
    email: (parent: { mid: string }) => parent.mid,
  },
  OwnerUserType: {
    user: (parent: { mid: string }, _, { loaders }) => loaders.user.load(parent.mid),
  },
  ApiSchemaType: {
    id: (parent: { _id: string }) => parent._id,
  },
  HeaderType: {
    id: (parent: { _id: string }) => parent._id,
  },
  NamespaceType: {
    id: (parent: { _id: string }) => parent._id,
    createdBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    updatedBy: (parent: { createdBy: string }, _, { loaders }) =>
      loaders.user.load(parent.createdBy),
    outageStatus: (parent: { outageStatusAppID: string }, _, { loaders }) =>
      loaders.outageStatus.load(parent.outageStatusAppID || ''),
  },
  NSEnvironmentType: {
    id: (parent: { _id: string }) => parent._id,
    isPublic: (parent: { flags: { isPublic: boolean } }) => parent?.flags?.isPublic,
    isSubscribed: async (parent: any, _, { loaders: { subscriptionStatus }, user }) => {
      if (!user.id) {
        throw Error('Unauthorized access field');
      }
      return subscriptionStatus.load({ envId: parent._id, userId: user.id });
    },
  },
  CMDBCode: {
    appID: (parent: { u_application_id: string }) => parent.u_application_id,
  },
  Query: {
    async listNamespaces(
      _root: any,
      {
        search,
        mid,
        sort = 'createdOn',
        sortDir = -1,
        limit,
        offset,
        apiCategory,
      }: ListNamespaceArg,
      { dataSources: { namespaceDB } },
    ) {
      return namespaceDB.listNamespaces({
        limit,
        offset,
        sort,
        mid,
        search,
        sortDir,
        category: apiCategory,
      });
    },
    getNamespaceById(_root: any, { id }: { id: string }, { dataSources: { namespaceDB } }) {
      return namespaceDB.getANamespaceById(id);
    },
    async getNamespaceBySlug(
      _root: any,
      { slug }: { slug: string },
      { dataSources: { namespaceDB } },
    ) {
      return namespaceDB.getANamespaceBySlug(slug);
    },
    async getApiCategoryCount(
      _root: any,
      { search, mid }: GetNamespaceCountArgs,
      { dataSources: { namespaceDB } },
    ) {
      return namespaceDB.getApiCategoryCount({ search, mid });
    },
    async fetchAPISchema(
      _root: any,
      { envSlug, config, shouldValidate = true }: FetchSchemaArgs,
      { dataSources: { namespaceDB } },
    ) {
      const { category, schemaEndpoint, headers = [] } = config || {};

      if (!envSlug) {
        const spec = await fetchSchema(category, schemaEndpoint, headers);
        if (shouldValidate) {
          await validateSpecSheet(spec, category);
        }
        const file = Buffer.from(spec).toString('base64');
        return {
          schema: null,
          namespaceID: null,
          file,
        };
      }
      const ns = await namespaceDB.getApiSchemaByEnvSlug(envSlug);
      if (!ns) {
        throw Error('Not found');
      }

      const env = ns?.schemas?.[0]?.environments.find(
        ({ slug }: { slug?: string }) => slug === envSlug,
      );
      if (!env) {
        throw Error('Not found');
      }
      const newHeaders = [...(env?.headers || []), ...headers];
      const newSchemaEndpoint = schemaEndpoint || env.schemaEndpoint;
      const newCategory = category || ns?.schemas[0].category;

      const spec = await fetchSchema(newCategory, newSchemaEndpoint, newHeaders);
      if (shouldValidate) {
        await validateSpecSheet(spec, category);
      }
      const file = Buffer.from(spec).toString('base64');
      return {
        schema: ns?.schemas?.[0],
        namespaceSlug: ns?.slug,
        file,
      };
    },
    listAPIOutageStatus: (_root: any, _arg: any, { dataSources: { outageStatusAPI } }) => {
      return outageStatusAPI.getOutageStatusList();
    },
    listCMDBCodes: (
      _root: any,
      { limit, name, appID }: GetCMDBCodeListArg,
      { dataSources: { cmdbCodeAPI } },
    ) => {
      return cmdbCodeAPI.getCMDBApps(name, appID, limit);
    },
  },
  Mutation: {
    async createNamespace(
      _root: any,
      { payload }: CreateNamespaceInputArgs,
      { dataSources: { namespaceDB }, user },
    ) {
      const { schemas } = payload;
      const description = payload.description || '';

      if (!user.id) {
        throw Error('Unauthorized Access');
      }

      const formatedSchema = schemas.map(({ environments, ...schema }) => ({
        ...schema,
        environments: environments.map((env) => ({
          ...env,
          flags: { isPublic: env.isPublic || false },
        })),
      }));

      const res = await namespaceDB.createNamespace({
        ...payload,
        createdBy: user.id,
        updatedBy: user.id,
        description,
        schemas: formatedSchema,
      });

      return res;
    },
    async updateNamespace(
      _root: any,
      { id, payload }: UpdateNamespaceArgs,
      { dataSources: { namespaceDB }, user },
    ) {
      const namespace = payload;

      const formatedSchema = namespace?.schemas?.map(({ environments, ...schema }) => ({
        ...schema,
        ...(environments && {
          environments: environments?.map((env) => ({
            ...env,
            flags: { isPublic: env.isPublic || false },
          })),
        }),
      }));

      if (!user.id) {
        throw Error('Unauthorized Access');
      }
      return namespaceDB.updateNamespace(id, { ...namespace, schemas: formatedSchema });
    },
    async deleteNamespace(
      _root: any,
      { id }: { id: string },
      { dataSources: { namespaceDB, specStoreDB, subscriptionDB }, user },
    ) {
      if (!user.id) {
        throw Error('Unauthorized Access');
      }

      const ns = await namespaceDB.deleteNamespace(id);
      await specStoreDB.deleteSpecsOfANamespace(id);
      await subscriptionDB.removeSubscribersOfANamespace(id);
      return ns;
    },
  },
};

export { NamespaceResolver as default };
