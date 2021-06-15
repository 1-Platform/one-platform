import { Users } from './schema';
import { pick } from 'lodash';
import { UserGroupAPIHelper } from '../helpers';

export const UserResolver = {
  Query: {
    findUsers ( root: any, args: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/users?criteria=${ args.value }&fields=${ args.ldapfield }` )
        .then( ( res: any ) => {
          return res.result;
        } );
    },
    getUsersBy ( root: any, args: any, ctx: any ) {
      const cleanedInput = pick( args, ['uid', 'rhatUUID'] );
      return Users.find( cleanedInput )
        .then( users => {
          if ( users.length > 0 ) {
            return users;
          }

          if ( !cleanedInput.uid && !cleanedInput.rhatUUID ) {
            throw new Error( 'User not found for the given input' );
          }

          /* Fetch the user from LDAP while adding to the db for future use */
          const key = cleanedInput.rhatUUID ? 'rhatUUID' : 'uid';
          const value = cleanedInput[ key ];
          return UserGroupAPIHelper
            .roverFetch( `/users/search?filter=((${ key }=${ value }))` )
            .then( ( res: any ) => {
              const user = res.result[ 0 ];
              if ( !user ) {
                throw new Error( `User not found for the given ${key}` );
              }
              user.isActive = true;
              user.updatedOn = new Date();
              Users.findOneAndUpdate( { rhatUuid: user.rhatUuid }, user , { new: true, upsert: true } )
              .exec();
              return [user];
            } );
        } );
    },
    listUsers ( root: any, args: any, ctx: any ) {
      return Users.find().exec();
    }
  },
  UserType: {
    manager ( parent: any, args: any, ctx: any ) {
      if ( parent.manager ) {
        return UserGroupAPIHelper.roverFetch( `/users/${ parent.manager.substring( 4, parent.manager.indexOf( ',ou' ) ) }` )
          .then( ( res ) => {
            return res;
          } );
      }
      else {
        return null;
      }
    },
    name ( parent: any, args: any, ctx: any ) {
      return parent.cn;
    },
    rhatUUID ( parent: any, args: any, ctx: any ) {
      return parent.rhatUuid;
    },
    roverGroups ( parent: any, args: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/users/${ parent.uid }/groups` )
        .then( ( res ) => res.result );
    }
  },
  RoverUserType: {
    manager ( parent: any, args: any, ctx: any ) {
      if ( parent.manager ) {
        return UserGroupAPIHelper.roverFetch( `/users/${ parent.manager.substring( 4, parent.manager.indexOf( ',ou' ) ) }` )
          .then( ( res ) => {
            return res;
          } );
      }
      else {
        return null;
      }
    },
    name ( parent: any, args: any, ctx: any ) {
      return parent.cn;
    },
    rhatUUID ( parent: any, args: any, ctx: any ) {
      return parent.rhatUuid;
    },
    roverGroups ( parent: any, args: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/users/${ parent.uid }/groups` )
        .then( ( res ) => res.result );
    }
  },
  Mutation: {
    addUser ( root: any, { input }: any, ctx: any ) {
      // Reverse mapping to handle familiar names
      input.rhatUuid = input.rhatUUID;
      input.cn = input.name;
      const data = new Users( input );
      data.isActive = true;
      return data.save();
    },
    addUserFromRover( root: any, { uid }: any, ctx: any ) {
      return Users
        .findOne( { uid } )
        .exec()
        .then( ( data: any ) => {
          if ( data ) {
            return data;
          }
          return UserGroupAPIHelper
            .roverFetch( `/users/search?filter=((uid=${ uid }))` )
            .then( ( res: any ) => {
              const user = res.result[ 0 ];
              user.isActive = true;
              user.updatedOn = new Date();
              user.createdOn = new Date();
              return Users.findOneAndUpdate( { rhatUuid: user.rhatUuid }, user, { new: true, upsert: true } )
                .exec()
                .then( user => user );
            } );
        } );
    },
    deleteUser ( root: any, { _id }: any, ctx: any ) {
      return Users
        .findByIdAndRemove( _id )
        .exec();
    },
    updateUser ( root: any, { input }: any, ctx: any ) {
      // Reverse mapping to handle familiar names
      input.cn = input.name;
      return Users
        .findOneAndUpdate( { rhatUuid: input.rhatUUID }, input, { new: true } )
        .exec();
    }
  }
};
