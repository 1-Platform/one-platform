import { Groups } from './schema';
import { UserGroupAPIHelper } from '../helpers';

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
    group ( root: any, { cn }: GraphQLArgs, ctx: any ) {
      return Groups
        .find({ ldapCommonName: cn })
        .exec()
        .then( res => res[0] );
    },
    findGroups ( root: any, { selector, limit }: GraphQLArgs, ctx: any ) {
      return Groups
        .find( selector )
        .limit( limit )
        .exec();
    }
  },
  Group: {
    members ( root: any, GraphQLArgs: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/groups/${ ( root[0] || root ).ldapCommonName }` )
            .then( ( res ) => {
              return res.result?.memberUids.map( ( member: string ) => {
                return member.substring( 4, member.indexOf( ',ou' ) );
              } );
          } );
      }
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
