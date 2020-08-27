import { SearchIndexHelper } from './helpers';

export const SearchResolver = {
  Query: {
    search ( root: any, args: any, ctx: any ) {
      return SearchIndexHelper.search( args ).then( res => res);
    }
  },
  Mutation: {
    manageIndex ( root: any, args: any, ctx: any ) {
      return SearchIndexHelper.index( args.input ).then( res => res );
    },
    deleteIndex(root: any, args: any, ctx: any) {
      return SearchIndexHelper.delete( args.input ).then( res => res );
    }
  }
}
