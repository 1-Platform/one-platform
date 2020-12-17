import { Groups } from './schema';

export const GroupResolver = {
  Query: {
    listGroups ( root: any, { limit }: GraphQLArgs, ctx: any ) {
      return Groups
        .find()
        .limit( limit )
        .exec();
    },
    getGroupsBy ( root: any, { selector, limit }: GraphQLArgs, ctx: any ) {
      return Groups
        .find( selector )
        .limit( limit )
        .exec();
    },
  },
  Mutation: {
    addGroup ( root: any, { payload }: GraphQLArgs, ctx: any ) {
      return new Groups( payload )
        .save();
    },
    updateGroup ( root: any, { id, payload }: GraphQLArgs, ctx: any ) {
      return Groups
        .findOneAndUpdate( id, {...payload, updatedOn: new Date() }, { new: true } )
        .exec();
    },
    deleteGroup ( root: any, { id }: GraphQLArgs, ctx: any ) {
      return Groups
        .findByIdAndRemove( id )
        .exec();
    },
  },
};
