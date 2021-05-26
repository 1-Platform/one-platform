import { Users } from './schema';
import { pick, compact } from 'lodash';
import { UserGroupAPIHelper } from '../helpers';

export const UserResolver = {
  Query: {
    user ( root: any, args: any, ctx: any ) {
      const cleanedInput: any = pick( args, [ 'uid', 'rhatUUID' ] );
      const arr = [];
      for ( let key in cleanedInput ) {
        if ( cleanedInput.hasOwnProperty( key ) ) {
          arr.push( key + '=' + cleanedInput[ key ] );
        }
      };
      return UserGroupAPIHelper.roverFetch( `/users/search?filter=((${ arr.join( ',' ) }))` )
        .then( ( res: any ) => res.result[0] );
    },
    findUsers ( root: any, args: any, ctx: any ) {
      return UserGroupAPIHelper.roverFetch( `/users?criteria=${ args.value }&fields=${ args.ldapfield }` )
        .then( ( res: any ) => {
          return res.result;
        } );
    },
    getUsersBy ( root: any, args: any, ctx: any ) {
      const cleanedInput = pick( args, ['uid', 'rhatUUID', 'apiRole', 'name'] );
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
            .addUserLDAP( `${ key }=${ value }` )
            .then( res => [ res ] );
        } );
    },
    listUsers ( root: any, args: any, ctx: any ) {
      return Users.find().exec();
    },
    getGroupMembers ( root: any, args: any, ctx: any ) {
      const groupMembers: any = [];
      return UserGroupAPIHelper.getProfilesBy( `(cn=${ args.cn })` )
        .then( ( response: any ) => {
          response.uniqueMember.map( ( member: any ) => {
            groupMembers.push( member.substring( member.indexOf( 'uid=' ) + 4, member.indexOf( ',' ) ) );
          } );
        } )
        .then( () => {
          return groupMembers.map( ( user: any, index: any ) => {
            return UserGroupAPIHelper.getProfilesBy( `(uid=${ user })` )
              .catch( err => {
                console.log( 'error', err );
                throw err;
              } );
          } );
        } )
        .then( userPromise => Promise.all( userPromise ) )
        .then( users => compact( users ) )
        .catch( err => {
          throw err;
        } );
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
    roverGroups ( parent: any, args: any, ctx: any ) {
        return UserGroupAPIHelper.roverFetch( `/users/${ parent.uid }/groups` )
        .then( ( res ) => res.result );
    },

  },
  Mutation: {
    addUser ( root: any, { input }: any, ctx: any ) {
      const data = new Users( input );
      data.isActive = true;
      return data.save();
    },
    addUserFromLDAP ( root: any, { uid }: any, ctx: any ) {
      return Users
        .findOne( { uid } )
        .exec()
        .then( ( data: any ) => {
          if ( data ) {
            return data;
          }
          return UserGroupAPIHelper
            .addUserLDAP( `uid=${ uid }` )
            .then( res => [ res ] );
        } );
    },
    deleteUser ( root: any, { _id }: any, ctx: any ) {
      return Users
        .findByIdAndRemove( _id )
        .exec();
    },
    updateUser ( root: any, { input }: any, ctx: any ) {
      return Users
        .findByIdAndUpdate( input._id, input, { new: true } )
        .exec();
    }
  }
};
