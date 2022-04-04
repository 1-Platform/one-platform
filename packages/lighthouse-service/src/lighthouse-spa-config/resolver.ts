import { FilterQuery } from 'mongoose';
import Logger from '../lib/logger';
import { lhDbManager } from '../lighthouse-db-manager';
import { populateMongooseDocWithUser, getUserProfile } from './helpers';
import { LHSpaConfig } from './schema';

export const LHSpaConfigResolver = {
  Query: {
    async listLHSpaConfigs(root: any, args: any) {
      const { limit, offset, user } = args;

      const filters: FilterQuery<LHSpaConfigType> = {};
      if (user) filters.createdBy = user;

      const lhSpaConfigs = (await LHSpaConfig.find(filters as any)
        .limit(limit || 100)
        .skip(offset || 0)
        .lean()
        .exec()) as LHSpaConfigType[];

      const userQueryCache: Record<string, UserProfileType> = {};

      return lhSpaConfigs.map(async (config) => {
        const lhSpaConfig = { ...config };
        const rhUUID = lhSpaConfig.createdBy as string;
        // if not saved in queryCache fetch it from user service api
        if (!userQueryCache?.[rhUUID]) {
          try {
            const userData = await getUserProfile(rhUUID);
            userQueryCache[rhUUID] = userData;
          } catch (error) {
            Logger.error(error);
          }
        }
        lhSpaConfig.createdBy = userQueryCache[rhUUID];
        lhSpaConfig.updatedBy = userQueryCache[rhUUID];
        return lhSpaConfig;
      });
    },
    async getLHSpaConfigById(root: any, args: any) {
      const { id } = args;
      const property = await LHSpaConfig.findById(id).lean().exec();
      if (!property) return {};
      /**
       * populate object user field with user data from user-group service
       * if the fetch fails inorder to not break the query returning an empty object
       */
      return populateMongooseDocWithUser(property as any);
    },
    async getLHSpaConfigByAppId(root: any, args: any) {
      const { appId } = args;
      const property = await LHSpaConfig.findOne({ appId }).lean().exec();
      if (!property) return {};
      return populateMongooseDocWithUser(property as any);
    },
    async getLHScoreByAppId(root: any, args: any) {
      const { appId } = args;
      // this query is written mainly for grafana
      // this is avoid throwing errors on when app is not registered yet
      const emptyValues = {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        pwa: 0,
      };
      const property = await LHSpaConfig.findOne({ appId }).lean().exec();
      if (!property) {
        return emptyValues;
      }

      const projectBuilds = await lhDbManager.getAllBuilds(
        property.projectId,
        property.branch,
        1,
      );
      if (!projectBuilds?.length) {
        return emptyValues;
      }

      const lhScore = await lhDbManager.getLHScores(
        property.projectId,
        projectBuilds.map(({ id }: any) => id),
      );

      return lhScore[projectBuilds[0].id];
    },
  },
  Mutation: {
    async createLHSpaConfig(root: any, args: any) {
      const { lhSpaConfig } = args;
      const user = await getUserProfile(lhSpaConfig.createdBy);
      lhSpaConfig.updatedBy = user.rhatUUID;
      // save to db
      const doc = { $set: lhSpaConfig };
      const options = { upsert: true };
      const savedLhSpaDoc = await LHSpaConfig.updateOne(
        { appId: lhSpaConfig.appId },
        doc,
        options,
      ).then(() => LHSpaConfig.find({ appId: lhSpaConfig.appId }).lean().exec());
      return populateMongooseDocWithUser(savedLhSpaDoc[0] as any);
    },
    async updateLHSpaConfig(root: any, args: any) {
      const { id, data } = args;
      const mongoosePropertyDoc = await LHSpaConfig.findById(id).lean().exec();

      if (data.updatedBy !== mongoosePropertyDoc?.createdBy) throw Error('Unauthorised access');

      const updatedDoc = await LHSpaConfig.findByIdAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        mongoosePropertyDoc?._id,
        data,
        { new: true },
      )
        .lean()
        .exec();
      return populateMongooseDocWithUser(updatedDoc as any);
    },
    async deleteLHSpaConfig(root: any, args: any) {
      const { id } = args;
      const mongoosePropertyDoc = await LHSpaConfig.findByIdAndDelete(id)
        .lean()
        .exec();
      return populateMongooseDocWithUser(mongoosePropertyDoc as any);
    },
  },
};
