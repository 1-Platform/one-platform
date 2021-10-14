import * as searchService from "../services/search";

export const SearchResolver = {
  Query: {
    search(root: any, args: any, ctx: any) {
      return searchService.search(args);
    },
  },
  Mutation: {
    manageIndex(root: any, { input, mode }: any, ctx: any) {
      if (mode === "index") {
        return searchService.index(input);
      } else if (mode === "delete") {
        return searchService.deleteIndex(input);
      }
      throw new Error("Invalid mode: " + mode);
    },
    createUpdateIndex(root: any, args: any, ctx: any) {
      return searchService.index(args.input, 3);
    },
    deleteIndex(root: any, args: any, ctx: any) {
      return searchService.deleteIndex(args.input);
    },
  },
};
