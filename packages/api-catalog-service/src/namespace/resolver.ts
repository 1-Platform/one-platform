/* eslint-disable @typescript-eslint/no-unused-vars */
import { uniq } from 'lodash';
import APICatalogHelper from '../shared/helpers';
import { Namespace } from './schema';

const NamespaceResolver = {
  Query: {
    listNamespaces(root: any, { limit, offset }: ListNamespacesArgs, ctx: any) {
      return Namespace.find()
        .limit(limit || 10)
        .skip(offset || 0)
        .exec()
        .then(async (namespaces: NamespaceType[]) => {
          if (namespaces.length) {
            // Fetch user information associated with this records.
            let userIds: string[] = [];
            namespaces.forEach((namespace: NamespaceType) => {
              if (namespace.createdBy) {
                userIds.push(namespace.createdBy);
              }
              if (namespace.updatedBy) {
                userIds.push(namespace.updatedBy);
              }
            });
            userIds = uniq(userIds);
            // Build a single user query for the namespace
            const userQuery = await APICatalogHelper.buildUserQuery(userIds);
            const userData: UserType[] = await APICatalogHelper.fetchUserProfile(userQuery);

            // Assign the parsed user information with the fields.
            return namespaces.map((namespace) => {
              const nsRecord = namespace;
              if (namespace.createdBy) {
                nsRecord.createdBy = userData.find(
                  (user) => user?.rhatUUID === namespace?.createdBy,
                )?.mail;
              }
              if (namespace.updatedBy) {
                nsRecord.updatedBy = userData.find(
                  (user) => user?.rhatUUID === namespace?.updatedBy,
                )?.mail;
              }
              return nsRecord;
            });
          }
          return namespaces;
        });
    },
    getNamespaceById(root: any, { id }: GetNamespaceByIdArgs, ctx: any) {
      let userIds: string[] = [];
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return Namespace.findById(id)
          .exec()
          .then(async (namespace) => {
            if (namespace) {
              const nsRecord = namespace;
              if (namespace.createdBy) {
                userIds.push(namespace.createdBy);
              }
              if (namespace.updatedBy) {
                userIds.push(namespace.updatedBy);
              }
              userIds = uniq(userIds);
              // Build a single user query for the namespace
              const userQuery = await APICatalogHelper.buildUserQuery(userIds);
              const userData: UserType[] = await APICatalogHelper.fetchUserProfile(userQuery);
              // Assign the parsed user information with the fields.
              if (namespace.createdBy) {
                nsRecord.createdBy = userData.find(
                  (user) => user?.rhatUUID === namespace?.createdBy,
                )?.mail;
              }
              if (namespace.updatedBy) {
                nsRecord.updatedBy = userData.find(
                  (user) => user?.rhatUUID === namespace?.updatedBy,
                )?.mail;
              }
              return nsRecord;
            }
            return null;
          });
      }
      throw new Error('Please provide valid id');
    },
    async fetchAPISchema(
      root: any,
      { category, schemaEndpoint, headers }: FetchApiSchemaArgs,
      ctx: any,
    ) {
      return APICatalogHelper.fetchSchema(
        category as ApiCategory,
        schemaEndpoint as string,
        headers as HeaderType[],
      );
    },
  },
  Mutation: {
    async createNamespace(
      root: any,
      { payload }: CreateNamespaceArgs,
      ctx: any,
    ) {
      const namespace = payload;
      if (!payload?.createdOn) {
        namespace.createdOn = new Date();
      }
      if (payload?.id) {
        // eslint-disable-next-line no-underscore-dangle
        (namespace as any)._id = payload?.id;
      }
      (namespace as any).hash = await APICatalogHelper.manageApiHash(payload);
      return new Namespace(namespace).save();
    },
    updateNamespace(root: any, { id, payload }: UpdateNamespaceArgs, ctx: any) {
      const namespace = payload;
      if (!payload?.updatedOn) {
        namespace.updatedOn = new Date();
      }
      return Namespace.findByIdAndUpdate(id, namespace, {
        new: true,
      }).exec();
    },
    deleteNamespace(root: any, { id }: DeleteNamespaceArgs, ctx: any) {
      return Namespace.findByIdAndRemove(id).exec();
    },
    async addNamespaceSubscriber(
      root: any,
      { id, payload }: AddNamespaceSubscriberArgs,
      ctx: any,
    ) {
      return Namespace.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $push: {
            subscribers: payload,
          },
        },
        { upsert: true, new: true },
      ).exec();
    },
    async removeNamespaceSubscriber(
      root: any,
      { id, payload }: RemoveNamespaceSubscriberArgs,
      ctx: any,
    ) {
      return Namespace.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $pull: {
            subscribers: payload,
          },
        },
        { multi: true, new: true },
      ).exec();
    },
  },
};

export { NamespaceResolver as default };
