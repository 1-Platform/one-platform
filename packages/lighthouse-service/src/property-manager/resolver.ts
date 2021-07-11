import { FilterQuery } from "mongoose";
import { getUserProfile, populateMongooseDocWithUser } from "./helpers";
import { Property } from "./schema";

export const PropertyResolver = {
  Query: {
    async listLHProperties(root: any, args: any, ctx: any) {
      const { limit, offset, search, user } = args;

      const filters: FilterQuery<PropertyType> = {
        name: { $regex: search || "" },
      };
      if (user) filters.createdBy = user;

      const properties = await Property.find(filters)
        .limit(limit || 100)
        .skip(offset || 0)
        .exec();

      const userQueryCache: Record<string, PropertyUserProfileType> = {};

      return properties.map(async (mongoosePropertyDoc) => {
        const property = mongoosePropertyDoc.toObject({ virtuals: true });
        const rhUUID = property.createdBy as string;
        // if not saved in queryCache fetch it from user service api
        if (!userQueryCache?.[rhUUID]) {
          const user = await getUserProfile(rhUUID);
          userQueryCache[rhUUID] = user;
        }
        property.createdBy = userQueryCache[rhUUID];
        property.updatedBy = userQueryCache[rhUUID];
        return property;
      });
    },
    async getLHPropertyById(root: any, args: any, ctx: any) {
      const { id } = args;
      const mongoosePropertyDoc = await Property.findById(id).exec();
      if (!mongoosePropertyDoc) return {};
      const property: PropertyType = mongoosePropertyDoc.toObject({
        virtuals: true,
      });
      // populate object user field with user data from user-group service
      const user = await getUserProfile(property.createdBy as string);
      property.createdBy = user;
      property.updatedBy = user;
      return property;
    },
  },
  Mutation: {
    async createLHProperty(root: any, args: any, ctx: any) {
      const { property } = args;
      property.updatedBy = property.createdBy;
      const mongoosePropertyDoc = new Property(property);
      const savedProperty = await mongoosePropertyDoc.save();
      return populateMongooseDocWithUser(savedProperty);
    },
    async updateLHProperty(root: any, args: any, ctx: any) {
      const { id, data } = args;
      const mongoosePropertyDoc = await Property.findById(id).exec();
      if (data.updatedBy !== mongoosePropertyDoc?.createdBy)
        throw Error("Unauthorised access");
      const updatedDoc = await Property.findByIdAndUpdate(
        mongoosePropertyDoc?.id,
        data,
        { new: true }
      ).exec();
      return populateMongooseDocWithUser(updatedDoc);
    },
    async deleteLHProperty(root: any, args: any, ctx: any) {
      const { id } = args;
      const mongoosePropertyDoc = await Property.findByIdAndDelete(id).exec();
      return populateMongooseDocWithUser(mongoosePropertyDoc);
    },
    async createLHApp(root: any, args: any, ctx: any) {
      const { propertyId, appData } = args;
      return Property.findByIdAndUpdate(
        propertyId,
        {
          $push: { apps: appData },
        },
        { new: true }
      ).exec();
    },
    async updateLHApp(root: any, args: any, ctx: any) {
      const { appId, appData } = args;
      /**
       * To patch a sub document we use set fn. of mongoose
       * apps.$.name = name
       * we dynamically convert the input response as its same for doc model
       */
      const appPatchQuery = Object.entries(appData).reduce(
        (query: Record<string, unknown>, [type, value]) => {
          query[`apps.$.${type}`] = value;
          return query;
        },
        {}
      );
      return Property.findOneAndUpdate({ "apps._id": appId }, appPatchQuery, {
        new: true,
      }).exec();
    },
    async deleteLHApp(root: any, args: any, ctx: any) {
      const { appId } = args;
      return Property.findOneAndUpdate(
        { "apps._id": appId },
        {
          $pull: {
            apps: { _id: appId },
          },
        },
        {
          new: true,
        }
      ).exec();
    },
  },
};
