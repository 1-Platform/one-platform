import { Document, Model, model, Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { SpecSheetSchema } from './specSheet';
import { INamespaceDoc } from './types';

export const NamespaceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      default: () => nanoid(6),
    },
    tags: [String],
    owners: [
      {
        mid: {
          type: String,
        },
        group: {
          type: String,
          enum: ['MAILING_LIST', 'USER'],
        },
      },
    ],
    schemas: [SpecSheetSchema],
    createdBy: {
      type: String,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
);

export interface NamespaceModel extends INamespaceDoc, Document {}

type NamespaceModelStatic = Model<NamespaceModel>;

export const Namespace: Model<NamespaceModel> = model<NamespaceModel, NamespaceModelStatic>(
  'Namespace',
  NamespaceSchema,
);
