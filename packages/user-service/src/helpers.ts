import { createClient } from 'ldapjs';
import { User } from './schema';
import * as _ from 'lodash';
import moment from 'moment';

class UserGroupApiHelper {
  private static UserGroupHelperInstance: UserGroupApiHelper;
  ldapHost: string | any = process.env.LDAP_HOST;
  ldapBase: string | any = process.env.LDAP_BASE;
  constructor () { }
  public static getApiInstance () {
    if ( !UserGroupApiHelper.UserGroupHelperInstance ) {
      UserGroupApiHelper.UserGroupHelperInstance = new UserGroupApiHelper();
    }
    return UserGroupApiHelper.UserGroupHelperInstance;
  }

  // Helper function to fetch user/group profile from LDAP
  public getProfilesBy ( profile_param: string ) {
    return new Promise( ( resolve, reject ) => {
      const ldapClient = createClient( { url: this.ldapHost, reconnect: true } );
      const search_options: Object = {
        scope: `sub`,
        filter: `${ profile_param }`,
        attributes: `*`
      };
      let profile: LdapType;
      ldapClient.search( this.ldapBase, search_options, ( err, response ) => {
        response.on( `searchEntry`, ( entry ) => {
          profile = entry.object;
        } );
        response.on( `error`, ( error: Error ) => {
          console.error( `LDAP error: ` + error.message );
          reject( new Error( 'LDAP ERROR' ) );
          ldapClient.destroy();
        } );
        response.on( `end`, ( result: any ) => {
          resolve( profile );
          ldapClient.destroy();
        } );
      } );
    } );
  }

  // Helper function for the database interaction with ldap
  public addUserLDAP ( profile_param: string ) {
    return new Promise( ( resolve, reject ) => {
      this.getProfilesBy( profile_param ).then( ( response: any ) => {
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
            createdBy: response.rhatUUID,
            createdOn: moment.utc( new Date() )
          } );
          resolve( newUser.save() );
        } else {
          reject( new Error( 'User Not Found' ) );
        }
      } );
    } );
  }
}

export const UserGroupAPIHelper = UserGroupApiHelper.getApiInstance();
