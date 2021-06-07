import { createClient } from 'ldapjs';
import { Users } from './users/schema';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import fetch from 'node-fetch';
import https from 'https';

const redisOptions: Redis.RedisOptions = {
  host: process.env.REDIS_SERVICE_HOST,
  port: Number.parseInt( process.env.REDIS_SERVICE_PORT || '6379', 10 ),
  retryStrategy: ( times: any ) => {
    return Math.min( times * 50, 2000 );
  }
};

export const pubsub = new RedisPubSub( {
  publisher: new Redis( redisOptions ),
  subscriber: new Redis( redisOptions ),
} );

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
  public getProfilesBy ( profile_param: string ): Promise<LdapType> {
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
    return this.getProfilesBy( profile_param )
      .then( ( response: any ) => {
        if ( isEmpty( response ) ) {
          throw new Error( 'User Not Found' );
        }
        const groups: any = [];
        response.memberOf.map( ( group: any ) => {
          groups.push( group.substring( group.indexOf( `cn=` ) + 3, group.indexOf( `,` ) ) );
        } );
        return Users
          .findOneAndUpdate( { rhatUUID: response.rhatUUID }, {
            uid: response.uid,
            name: response.cn,
            rhatUUID: response.rhatUUID,
            title: response.title,
            memberOf: groups,
            isActive: true,
            apiRole: ( groups.includes( 'one-portal-devel' ) ) ? `ADMIN` : 'USER',
            createdBy: response.rhatUUID,
            createdOn: moment.utc( new Date() ).toDate(),
          }, { new: true, upsert: true } )
          .exec();
      } );
  }
  // Helper function for rover interaction
  public roverFetch ( urlPart: String ) {
    console.log( 'Inside roverFetch' );
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
    let credentials = `${ process.env.ROVER_USERNAME }:${ process.env.ROVER_PASSWORD }`;
    return fetch(
      `${ process.env.ROVER_API }${ urlPart }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${ Buffer.from( credentials ).toString( 'base64' ) }`
        },
        agent: httpsAgent
      }
    )
      .then( ( res: any ) => {
        if ( !res.ok ) {
          console.error( 'Request Failed:', { statusText: res.statusText, status: res.status });
        }
        return res;
      } )
      .then( res => res.json() )
      .then( res => res.result )
      .catch( console.error );
  }
}

export const UserGroupAPIHelper = UserGroupApiHelper.getApiInstance();
