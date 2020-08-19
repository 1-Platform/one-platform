import { Users } from './schema';
import * as _ from 'lodash';
import { UserGroupAPIHelper } from '../helpers';

export const UserResolver = {
  Query: {
    getUsersBy ( root: any, args: any, ctx: any ) {
      const cleanedInput = _.pick( args, ['uid', 'rhatUUID', 'apiRole', 'name'] );
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
        .then( users => _.compact( users ) )
        .catch( err => {
          throw err;
        } );
    }
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
