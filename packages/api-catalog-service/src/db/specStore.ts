import { Document, Model, model, Schema } from 'mongoose';
import { ISpecStoreDoc } from './types';

export const SpecStoreSchema: Schema = new Schema(
  {
    namespaceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    schemaId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    environmentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    spec: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
);

export interface SpecStoreModel extends ISpecStoreDoc, Document {}

type SpecStoreModelStatic = Model<SpecStoreModel>;

export const SpecStore: Model<SpecStoreModel> = model<SpecStoreModel, SpecStoreModelStatic>(
  'Specstore',
  SpecStoreSchema,
);
