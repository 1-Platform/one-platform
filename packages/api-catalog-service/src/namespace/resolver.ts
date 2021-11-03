/* eslint-disable @typescript-eslint/no-unused-vars */
import APICatalogHelper from '../shared/helpers';
import { Namespace } from './schema';

const NamespaceResolver = {
  ApiSortType: {
    CREATED_AT: 'createdOn',
    UPDATED_AT: 'updatedOn',
  },
  ApiOwnerType: {
    // eslint-disable-next-line no-underscore-dangle
    __resolveType(obj:ApiOwnerType, context:any, info:any) {
      if (obj.group === 'USER') {
        return 'OwnerUserType';
      }
      return 'OwnerMailingType';
    },
  },
  Query: {
    async listNamespaces(root: any, {
      limit = 10, offset = 0, search, sort = 'createdOn', mid, apiCategory,
    }: ListNamespacesArgs, ctx: any) {
      // conditional filters
      const match: Record<string, unknown> = {};
      if (search) match.name = { $regex: search, $options: 'i' };
      if (mid) match.$or = [{ createdBy: mid }, { 'owners.mid': mid }];
      if (apiCategory) match.category = apiCategory;
      const paginatedNamespace = await Namespace.aggregate([
        { $match: match },
        { $sort: { [sort]: -1 } },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            total: [{ $count: 'total' }],
          },
        },
      ]).exec();
      const namespaceRecords = paginatedNamespace[0].data.map((doc: NamespaceDoc) => Namespace.hydrate(doc));
      const count = paginatedNamespace[0].total[0]?.total || 0;
      return {
        count,
        data: APICatalogHelper.formatNamespaceDoc(namespaceRecords),
      };
    },
    getNamespaceById(root: any, { id }: GetNamespaceByIdArgs, ctx: any) {
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return Namespace.findById(id)
          .exec()
          .then(async (namespace) => {
            if (namespace) {
              const formatedNamespace = await APICatalogHelper.formatNamespaceDoc([namespace]);
              return formatedNamespace[0];
            }
            return null;
          });
      }
      throw new Error('Please provide valid id');
    },
    async getNamespaceCount(root: any, { search, mid }: GetNamespaceCountArgs, ctx: any) {
      // conditional filters
      const match: Record<string, unknown> = {};
      if (search) match.name = { $regex: search, $options: 'i' };
      if (mid) match.$or = [{ createdBy: mid }, { 'owners.mid': mid }];

      const namespaceCount = await Namespace.aggregate([
        { $match: match },
        {
          $facet: {
            rest: [{ $match: { category: 'REST' } }, { $count: 'rest' }],
            graphql: [{ $match: { category: 'GRAPHQL' } }, { $count: 'graphql' }],
          },
        },
      ]).exec();
      const rest = namespaceCount[0].rest[0]?.rest || 0;
      const graphql = namespaceCount[0].graphql[0]?.graphql || 0;
      return { all: rest + graphql, rest, graphql };
    },
    async getNamespaceSubscriberStatus(root: any, { id, email }: GetNamespaceSubscriberStatusArgs, ctx: any) {
      const nsDoc = await Namespace.find({ _id: id, 'subscribers.email': email }).select('-subscribers').lean().exec();
      const isSubscribed = nsDoc.length > 0;
      return { subscribed: isSubscribed };
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
      if (!payload?.createdOn) namespace.createdOn = new Date();
      // eslint-disable-next-line no-underscore-dangle
      if (payload?.id) (namespace as any)._id = payload?.id;
      (namespace as any).hash = await APICatalogHelper.manageApiHash(payload);
      const nsDoc = await new Namespace(namespace).save();

      const formatedDoc = await APICatalogHelper.formatNamespaceDoc([nsDoc]);
      return formatedDoc[0];
    },
    async updateNamespace(root: any, { id, payload }: UpdateNamespaceArgs, ctx: any) {
      const namespace = payload;
      if (!payload?.updatedOn) namespace.updatedOn = new Date();

      const nsDoc = await Namespace.findByIdAndUpdate(id, namespace, {
        new: true,
      }).exec();

      if (!nsDoc) return null;
      const formatedDoc = await APICatalogHelper.formatNamespaceDoc([nsDoc]);
      return formatedDoc[0];
    },
    async deleteNamespace(root: any, { id }: DeleteNamespaceArgs, ctx: any) {
      const nsDoc = await Namespace.findByIdAndRemove(id).exec();

      if (!nsDoc) return null;
      const formatedDoc = await APICatalogHelper.formatNamespaceDoc([nsDoc]);
      return formatedDoc[0];
    },
    async addNamespaceSubscriber(
      root: any,
      { id, payload }: AddNamespaceSubscriberArgs,
      ctx: any,
    ) {
      const nsDoc = await Namespace.findOneAndUpdate(
        {
          _id: id,
          'subscribers.email': { $ne: payload.email },
        },
        {
          $push: {
            subscribers: payload,
          },
        },
        { upsert: true, new: true },
      ).exec();

      if (!nsDoc) return null;
      const formatedDoc = await APICatalogHelper.formatNamespaceDoc([nsDoc]);
      return formatedDoc[0];
    },
    async removeNamespaceSubscriber(
      root: any,
      { id, payload }: RemoveNamespaceSubscriberArgs,
      ctx: any,
    ) {
      const nsDoc = await Namespace.findOneAndUpdate(
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

      if (!nsDoc) return null;
      const formatedDoc = await APICatalogHelper.formatNamespaceDoc([nsDoc]);
      return formatedDoc[0];
    },
  },
};

export { NamespaceResolver as default };
