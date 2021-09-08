import { FilterQuery } from 'mongoose';
import { getUserProfile } from '../property-manager/helpers';
import { populateMongooseDocWithUser } from "./helpers";
import { LHSpaConfig } from "./schema";

export const LHSpaConfigResolver = {
  Query: {
    async listLHSpaConfigs(root: any, args: any, ctx: any) {
      const { limit, offset, user } = args;

      const filters: FilterQuery<LHSpaConfigType> = {};
      if (user) filters.createdBy = user;

      const lhSpaConfigs = await LHSpaConfig.find(filters)
        .limit(limit || 100)
        .skip(offset || 0).lean()
        .exec() as LHSpaConfigType[];

      const userQueryCache: Record<string, UserProfileType> = {};

      return lhSpaConfigs.map(async (lhSpaConfig) => {
        const rhUUID = lhSpaConfig.createdBy as string;
        // if not saved in queryCache fetch it from user service api
        if (!userQueryCache?.[rhUUID]) {
         try {
            const user = await getUserProfile(rhUUID);
            userQueryCache[rhUUID] = user;
         } catch (error) {
           console.error( error );
         }
        }
        lhSpaConfig.createdBy = userQueryCache[rhUUID];
        lhSpaConfig.updatedBy = userQueryCache[rhUUID];
        return lhSpaConfig;
      });
    },
    async getLHSpaConfigById(root: any, args: any, ctx: any) {
      const { id } = args;
      const property = await LHSpaConfig.findById(id).lean().exec();
      if (!property) return {};
      /**
       * populate object user field with user data from user-group service
       * if the fetch fails inorder to not break the query returning an empty object
       */
      return populateMongooseDocWithUser(property);
    },
    async getLHSpaConfigByAppId(root: any, args: any, ctx: any) {
      const { appId } = args;
      const property = await LHSpaConfig.findOne({ appId }).lean().exec();
      if (!property) return {};
      return populateMongooseDocWithUser(property);
    },
  },
  Mutation: {
    async createLHSpaConfig(root: any, args: any, ctx: any) {
      const { lhSpaConfig } = args;
      const user = await getUserProfile(lhSpaConfig.createdBy);
      lhSpaConfig.updatedBy = user.rhatUUID;
      // save to db
      const doc = { $set: lhSpaConfig };
      const options = { upsert: true };
      const savedLhSpaDoc = await LHSpaConfig.updateOne( { appId: lhSpaConfig.appId }, doc, options ).then( () => {
        return LHSpaConfig.find( { appId: lhSpaConfig.appId } ).lean().exec();
      } );
      return populateMongooseDocWithUser(savedLhSpaDoc[0]);
    },
    async updateLHSpaConfig(root: any, args: any, ctx: any) {
      const { id, data } = args;
      const mongoosePropertyDoc = await LHSpaConfig.findById(id).lean().exec();

      if (data.updatedBy !== mongoosePropertyDoc?.createdBy)
        throw Error("Unauthorised access");

      const updatedDoc = await LHSpaConfig.findByIdAndUpdate(
        mongoosePropertyDoc?._id,
        data,
        { new: true }
      )
        .lean()
        .exec();
      return populateMongooseDocWithUser(updatedDoc);
    },
    async deleteLHSpaConfig(root: any, args: any, ctx: any) {
      const { id } = args;
      const mongoosePropertyDoc = await LHSpaConfig.findByIdAndDelete(id)
        .lean()
        .exec();
      return populateMongooseDocWithUser(mongoosePropertyDoc);
    },
  },
};
