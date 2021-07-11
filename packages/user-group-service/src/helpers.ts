import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
const fetch = require( 'node-fetch' );

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
  constructor () { }
  public static getApiInstance () {
    if ( !UserGroupApiHelper.UserGroupHelperInstance ) {
      UserGroupApiHelper.UserGroupHelperInstance = new UserGroupApiHelper();
    }
    return UserGroupApiHelper.UserGroupHelperInstance;
  }

  // Helper function for rover interaction
  public roverFetch ( urlPart: String ) {
    let credentials = `${ process.env.ROVER_USERNAME }:${ process.env.ROVER_PASSWORD }`;
    return fetch(
      `${ process.env.ROVER_API }${ urlPart }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${ Buffer.from( credentials ).toString( 'base64' ) }`
        }
      }
    )
      .then( ( res: any ) => {
        if ( !res.ok ) {
          console.error( 'Request Failed:', { statusText: res.statusText, status: res.status });
        }
        return res;
      } )
      .then( ( res:any ) => res.json() )
      .then( ( res: any ) => res.result )
      .catch( console.error );
  }
}

export const UserGroupAPIHelper = UserGroupApiHelper.getApiInstance();
