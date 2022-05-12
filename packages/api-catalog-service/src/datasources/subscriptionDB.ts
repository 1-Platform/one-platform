import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Types } from 'mongoose';
import { SubscriptionModel } from 'db/subscription';
import { SubscriptionConfig } from './types';

export class SubscriptionDB extends MongoDataSource<SubscriptionModel, IContext> {
  async subscribeASchema({ namespaceID, email, envrionmentIDs, schemaID }: SubscriptionConfig) {
    const subscriber = this.context.user.id;
    const dbDocs = await this.findByFields({ namespace: namespaceID, subscriber });

    const subscription = dbDocs?.[0];
    if (subscription) {
      const subscribed = subscription.subscriptions.find(
        ({ spec: id }) => id.toString() === schemaID.toString(),
      );

      if (subscribed) {
        subscribed.environments = envrionmentIDs;
      } else {
        subscription.subscriptions.push({ spec: schemaID, environments: envrionmentIDs });
      }
      return subscription.save();
    }

    const Subscription = this.model;
    const doc = new Subscription({
      namespace: namespaceID,
      subscriber,
      subscriberEmail: email,
    });

    doc.subscriptions = [{ spec: schemaID, environments: envrionmentIDs }];
    return doc.save();
  }

  async getSubscriptionStatus(namespaceID: Types.ObjectId, schemaID: Types.ObjectId) {
    const subscriber = this.context.user.id;
    const dbDocs = await this.findByFields({ namespace: namespaceID, subscriber });
    const subscription = dbDocs?.[0];
    if (subscription) {
      const subscribed = subscription.subscriptions.find(({ spec: id }) => id === schemaID);
      return subscribed?.environments;
    }
    return null;
  }

  async removeSubscribersOfANamespace(namespaceId: string) {
    return this.model.deleteMany({ namespace: new Types.ObjectId(namespaceId) });
  }
}
