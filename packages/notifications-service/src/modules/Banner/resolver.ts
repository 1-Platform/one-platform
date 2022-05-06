import { IResolvers } from '@graphql-tools/utils';
import { getBanners } from '@setup/database';

const BannerResolver: IResolvers<any, IGQLContext> = {
  Query: {
    banners: (_, { url }) => {
      /* TODO: check if the user is allowed to see the banners */
      const currentDate = new Date();
      return getBanners()
        .find({
          urls: url,
          startsOn: { $lte: currentDate },
          endsOn: { $gt: currentDate },
        })
        .sort('createdOn', -1)
        .toArray();
    },
  },
  Mutation: {
    createBanner: async (_, { input }, { userId }) => {
      const currentDate = new Date();

      const startsOn = input.startsOn ?? currentDate;
      /* Set the default endDate as 1 year from start date */
      const endsOn =
        input.endsOn ??
        new Date(new Date(startsOn).setFullYear(startsOn.getFullYear() + 1));

      const record = await getBanners().insertOne({
        ...input,
        startsOn,
        endsOn,
        createdOn: currentDate,
        createdBy: userId,
      });

      return {
        ok: record.acknowledged,
        _id: record.insertedId,
      };
    },
    updateBanner: async (_, { _id, input }, { userId }) => {
      const banner = await getBanners().findOne({ _id });

      if (!banner) {
        throw new Error('Banner not found');
      }
      if (banner.createdBy !== userId) {
        throw new Error('Unauthorized');
      }

      const record = await getBanners().findOneAndUpdate(
        { _id: banner._id },
        { $set: input }
      );

      return {
        ok: Boolean(record.ok),
        _id,
        error: record.lastErrorObject,
      };
    },
    removeBanner: async (_, { _id }, { userId }) => {
      const banner = await getBanners().findOne({ _id });

      if (!banner) {
        throw new Error('Banner not found');
      }
      if (banner.createdBy !== userId) {
        throw new Error('Unauthorized');
      }

      const record = await getBanners().findOneAndDelete({ _id: banner._id });

      return {
        ok: Boolean(record.ok),
        _id,
        error: record.lastErrorObject,
      };
    },
  },
};

export default BannerResolver;
