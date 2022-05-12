import { Document, Model, model, Schema } from 'mongoose';
import { ISubscriptionDoc } from './types';

export const SubscriptionSchema: Schema = new Schema(
  {
    namespace: {
      type: Schema.Types.ObjectId,
      ref: 'Namespace',
      required: true,
    },
    subscriptions: [
      {
        _id: false,
        spec: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        environments: [{ _id: false, type: Schema.Types.ObjectId }],
      },
    ],
    subscriber: {
      type: String,
      required: true,
    },
    subscriberEmail: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
);

export interface SubscriptionModel extends ISubscriptionDoc, Document {}

type NamespaceModelStatic = Model<SubscriptionModel>;

export const Subscription: Model<SubscriptionModel> = model<
  SubscriptionModel,
  NamespaceModelStatic
>('Subscription', SubscriptionSchema);
