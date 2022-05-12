import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Types } from 'mongoose';
import { SpecStoreModel } from 'db/specStore';

export class SpecStoreDB extends MongoDataSource<SpecStoreModel, IContext> {
  async deleteSpecsOfANamespace(namespaceId: string) {
    return this.model.deleteMany({ namespaceId: new Types.ObjectId(namespaceId) });
  }
}
