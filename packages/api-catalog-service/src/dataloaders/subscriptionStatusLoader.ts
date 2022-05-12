import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { Subscription } from 'db/subscription';

type Key = {
  envId: Types.ObjectId;
  userId: string;
};

export const setupSubscriptionStatusLoader = () => {
  const loader = new DataLoader(
    async (keys: readonly Key[]) => {
      const ids = keys.map(({ envId }) => envId);
      const subscriber = keys?.[0]?.userId;

      const docs = await Subscription.aggregate([
        { $match: { 'subscriptions.environments': { $in: ids }, subscriber } },
        { $project: { subscription: '$subscriptions.environments' } },
        { $unwind: '$subscription' },
        { $unwind: '$subscription' },
      ]);
      const lookUpTable = docs.reduce((prev, curr) => ({ ...prev, [curr.subscription]: true }), {});
      return keys.map((key) => lookUpTable?.[key.envId.toString()] || false);
    },
    { cacheKeyFn: ({ envId }) => envId },
  );

  return loader;
};
