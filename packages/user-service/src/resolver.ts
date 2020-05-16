import { User } from './schema';
import * as _ from 'lodash';
import moment from 'moment';
import { UserGroupAPIHelper } from './helpers';

export const UserGroupResolver = {
  Query: {
    getUsersBy ( root: any, args: any, ctx: any ) {
      const keyParam = ( Object.keys( args )[ 0 ] ).toString();
      const valueParam = Object.values( args )[ 0 ];
      const query: any = {};
      query[ keyParam ] = valueParam;
      return User.find( query )
        .then( data => data )
        .catch( err => err );
    },
    listUsers ( root: any, args: any, ctx: any ) {
      return User.find()
        .then( data => data )
        .catch( err => err );
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
    addUser ( root: any, args: any, ctx: any ) {
      const data = new User( args.input );
      data.isActive = true;
      return data.save()
        .then( response => response )
        .catch( err => err );
    },
    addUserFromLDAP ( root: any, args: any, ctx: any ) {
      return User.findOne( { uid: args.uid } )
        .then( ( data: any ) => {
          if ( !data ) {
            return UserGroupAPIHelper.getProfilesBy( `(uid=${ args.uid })` ).then( ( response: any ) => {
              if ( !_.isEmpty( response ) ) {
                const groups: any = [];
                response.memberOf.map( ( group: any ) => {
                  groups.push( group.substring( group.indexOf( `cn=` ) + 3, group.indexOf( `,` ) ) );
                } );
                const newUser = new User( {
                  uid: response.uid,
                  name: response.cn,
                  rhatUUID: response.rhatUUID,
                  title: response.title,
                  memberOf: groups,
                  isActive: true,
                  apiRole: ( groups.includes( 'one-portal-devel' ) ) ? `ADMIN` : 'USER',
                  timestamp: {
                    createdAt: moment.utc( new Date() )
                  }
                } );
                return newUser.save();
              } else {
                return null;
              }
            } );
          } else if ( data ) {
            return data;
          }
        } )
        .catch( err => err );
    },
    deleteUser ( root: any, args: any, ctx: any ) {
      return User.findByIdAndRemove( args._id )
        .then( response => response )
        .catch( err => err );
    },
    updateUser ( root: any, args: any, ctx: any ) {
      return User.findById( args.input._id )
        .then( response => {
          return Object.assign( response, args.input )
            .save()
            .then( ( user: any ) => user );
        } )
        .catch( ( err: any ) => err );
    }
  }
};
