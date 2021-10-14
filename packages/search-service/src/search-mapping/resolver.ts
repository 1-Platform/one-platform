import { agenda } from "../scripts";
import { SearchMaps } from "./schema";

export const SearchMapResolver = {
  Query: {
    listSearchMap(root: any, args: any, ctx: any) {
      return SearchMaps.find().exec();
    },
    getSearchMap(root: any, args: any, ctx: any) {
      return SearchMaps.findById(args._id).exec();
    },
    async triggerSearchMap(root: any, args: any, ctx: any) {
      await agenda.now("indexing script", {});
      return "Indexing Search Maps has been triggered.";
    },
  },
  Mutation: {
    async createSearchMap(root: any, args: any, ctx: any) {
      return new SearchMaps(args.input).save();
    },
    updateSearchMap(root: any, args: any, ctx: any) {
      return SearchMaps.findByIdAndUpdate(args.input._id, args.input, {
        new: true,
      }).exec();
    },
    deleteSearchMap(root: any, args: any, ctx: any) {
      return SearchMaps.findByIdAndRemove(args._id).exec();
    },
  },
};
