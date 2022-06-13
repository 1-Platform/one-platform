import { Types } from 'mongoose';
import { Subscription } from 'db/subscription';
import { Namespace } from 'db/namespace';
import { SpecStore } from 'db/specStore';

export const getSubscribersOfAnEnv = async (
  namespaceId: string,
  schemaId: string,
  environmentId: string,
) => {
  const data = await Subscription.aggregate([
    {
      $match: {
        namespace: new Types.ObjectId(namespaceId),
        'subscriptions.spec': new Types.ObjectId(schemaId),
        'subscriptions.environments': new Types.ObjectId(environmentId),
      },
    },
    {
      $project: { subscriberEmail: 1, _id: 0 },
    },
  ]);

  return data;
};

export const getNamespaceDocsSortedByCreated = (limit: number, offset: number) => {
  return Namespace.find()
    .sort([['createdOn', -1]])
    .limit(limit)
    .skip(offset)
    .lean();
};

export const getRecentlySavedSpec = (
  namespaceId: string,
  schemaId: string,
  environmentId: string,
) => {
  return SpecStore.findOne({
    namespaceId,
    schemaId,
    environmentId,
  })
    .sort([['createdOn', -1]])
    .lean();
};

export const saveSpecSheet = (
  namespaceId: string,
  schemaId: string,
  environmentId: string,
  spec: string,
) => {
  const doc = new SpecStore({
    namespaceId,
    schemaId,
    environmentId,
    spec,
  });

  return doc.save();
};

export const setSchemEnvInValidState = (
  namespaceId: string,
  schemaId: string,
  environmentId: string,
  isInValid: boolean,
) => {
  return Namespace.findOneAndUpdate(
    { id: namespaceId },
    {
      $set: { 'schemas.$[schema].environments.$[env].isSchemaInValid': isInValid },
    },
    {
      arrayFilters: [
        {
          'env.id': environmentId,
        },
        {
          'schema.id': schemaId,
        },
      ],
    },
  ).exec();
};

export const getNamespaceOwners = (namespaceId: string) => {
  return Namespace.findById(namespaceId, { owners: 1 });
};
