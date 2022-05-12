import { MongoDataSource } from 'apollo-datasource-mongodb';
import { deepMergeByKey } from 'utils';

import { NamespaceModel } from 'db/namespace';

import {
  ApiCategoryCountArg,
  CreateNsDocArg,
  INameSpaceModelDoc,
  ListNamespaceArg,
  UpdateNsDocArg,
} from './types';

export class NamespaceDB extends MongoDataSource<NamespaceModel, IContext> {
  async getANamespaceById(id: string) {
    return this.findOneById(id);
  }

  async getANamespaceBySlug(slug: string) {
    return this.model.findOne({ slug });
  }

  async createNamespace(ns: CreateNsDocArg): Promise<INameSpaceModelDoc> {
    const Model = this.model;
    const doc = new Model(ns);
    return doc.save();
  }

  async updateNamespace(id: string, ns: UpdateNsDocArg): Promise<INameSpaceModelDoc | null> {
    const nsDoc = await this.model.findById(id).exec();
    const { user } = this.context;

    if (!nsDoc) {
      throw Error('Document not found');
    }

    if (!this.hasAccess(nsDoc, user.id)) {
      throw new Error('Unauthorized Access');
    }
    const updatedDoc = deepMergeByKey(nsDoc.toObject({ virtuals: true }), { id, ...ns }, 'id');

    return this.model.findByIdAndUpdate(id, updatedDoc, { new: true }).exec();
  }

  private hasAccess(doc: INameSpaceModelDoc, userId: string) {
    const isOwner = doc.owners.findIndex(({ mid }) => mid === userId) !== -1;
    const isCreator = doc.createdBy === userId;
    return isOwner || isCreator;
  }

  async deleteNamespace(id: string): Promise<INameSpaceModelDoc | null> {
    const nsDoc = await this.model.findById(id).exec();
    const { user } = this.context;

    if (!nsDoc) {
      throw Error('Document not found');
    }

    if (!this.hasAccess(nsDoc, user.id)) {
      throw new Error('Unauthorized Access');
    }

    return this.model.findByIdAndDelete(id, { new: true }).exec();
  }

  async listNamespaces({
    search,
    mid,
    sort = 'createdOn',
    limit = 20,
    offset = 0,
    sortDir = -1,
    category,
  }: ListNamespaceArg) {
    const match: Record<string, any> = {};
    if (mid) match.$or = [{ createdBy: mid }, { 'owners.mid': mid }];
    if (category) match['schemas.category'] = category;

    if (search) {
      const option = [
        { name: { $regex: search, $options: 'i' } },
        { 'schemas.name': { $regex: search, $options: 'i' } },
      ];
      if (match.$or) {
        match.$or.push(...option);
      } else {
        match.$or = option;
      }
    }

    const paginatedNamespace = await this.model
      .aggregate([
        { $match: match },
        { $sort: { [sort]: sortDir } },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            total: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    const { data } = paginatedNamespace[0];
    const count = paginatedNamespace[0].total[0]?.total || 0;
    return { data, count };
  }

  async getApiCategoryCount({ search, mid }: ApiCategoryCountArg) {
    const match: Record<string, any> = {};
    if (mid) match.$or = [{ createdBy: mid }, { 'owners.mid': mid }];

    if (search) {
      const option = [
        { name: { $regex: search, $options: 'i' } },
        { 'schemas.name': { $regex: search, $options: 'i' } },
      ];
      if (match.$or) {
        match.$or.push(...option);
      } else {
        match.$or = option;
      }
    }
    const namespaceCount = await this.model
      .aggregate([
        { $match: match },
        {
          $facet: {
            rest: [
              { $project: { 'schemas.category': 1 } },
              { $unwind: '$schemas' },
              { $match: { 'schemas.category': 'REST' } },
              { $count: 'rest' },
            ],
            graphql: [
              { $project: { 'schemas.category': 1 } },
              { $unwind: '$schemas' },
              { $match: { 'schemas.category': 'GRAPHQL' } },
              { $count: 'graphql' },
            ],
          },
        },
      ])
      .exec();

    const rest = namespaceCount[0].rest[0]?.rest || 0;
    const graphql = namespaceCount[0].graphql[0]?.graphql || 0;
    return { total: rest + graphql, rest, graphql };
  }

  async getApiSchemaByEnvSlug(slug: string) {
    return this.model.findOne(
      { 'schemas.environments.slug': slug },
      { slug: 1, schemas: { $elemMatch: { environments: { $elemMatch: { slug } } } } },
    );
  }
}
