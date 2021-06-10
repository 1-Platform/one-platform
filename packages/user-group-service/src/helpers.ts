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

  // Helper function for rover interaction
  public roverFetch ( urlPart: String ) {
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
