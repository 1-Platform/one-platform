import { Groups } from './schema';
import { Users } from '../users/schema';
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
        .find( { cn: cn } )
        .exec()
        .then( res => res[ 0 ] );
    }
  },
  Group: {
    members ( root: any, GraphQLArgs: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/groups/${ root.cn }` )
        .then( ( res: any ) => {
          const uids = res.result?.memberUids.map( ( member: string ) => {
            const uidPart = member.split( ',' ).find( ( part ) => part.startsWith( "uid=" ) );
            return uidPart && uidPart.substring( 4 );
          } );
          return Users.find( { "uid": { "$in": uids } } );
        } )
        .catch( ( err: Error ) => { throw ( 'There is some problem fetching members of the group.' ); } );
    }
  },
  Mutation: {
    addGroup ( root: any, { payload }: GraphQLArgs, ctx: any ) {
      return new Groups( payload )
        .save()
        .then( ( res: any ) => {
          const transformedData = UserGroupAPIHelper.formatSearchInput( res );
          UserGroupAPIHelper.manageSearchIndex(transformedData, 'index');
          return res;
        });
    },
    updateGroup ( root: any, { id, payload }: GraphQLArgs, ctx: any ) {
      return Groups
        .findByIdAndUpdate( id, { ...payload, updatedOn: new Date() }, { new: true } )
        .exec()
        .then( ( res: any ) => {
          const transformedData = UserGroupAPIHelper.formatSearchInput( res );
          UserGroupAPIHelper.manageSearchIndex(transformedData, 'index');
          return res;
        });
    },
    deleteGroup ( root: any, { id }: GraphQLArgs, ctx: any ) {
      return Groups
        .findByIdAndRemove( id )
        .exec()
        .then( ( res: any ) => {
          const input = {
            dataSource: "oneportal",
            documents: [ { 'id': res._id } ]
          };
          UserGroupAPIHelper.manageSearchIndex( input, 'delete' );
          return res;
        });
    },
  }
};
