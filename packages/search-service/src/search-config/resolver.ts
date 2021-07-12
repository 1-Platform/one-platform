import { SearchIndexHelper } from './helpers';

export const SearchResolver = {
  Query: {
    search ( root: any, args: any, ctx: any ) {
      return SearchIndexHelper.search( args );
    }
  },
  Mutation: {
    manageIndex ( root: any, args: any, ctx: any ) {
      return SearchIndexHelper.manageIndex( args.input, args.mode );
    },
    createUpdateIndex ( root: any, args: any, ctx: any ) {
      return SearchIndexHelper.index( args.input );
    },
    deleteIndex(root: any, args: any, ctx: any) {
      return SearchIndexHelper.delete( args.input );
    }
  }
}
