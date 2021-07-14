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
  // Helper function to format user service data for search service
    public formatSearchInput(data: any) {
        return {
            'input': {
                'dataSource': 'oneportal',
                'documents': {
                    'id': `${data._id}`,
                    'title': data.name,
                    'abstract': data.cn,
                    'description': data.name,
                    'icon': `assets/icons/user-1.svg`,
                    'uri': `/user-groups/group/${data.cn}`,
                    'tags': `User Group`,
                    'contentType': 'User Group',
                    'createdBy': data?.createdBy || '',
                    'createdDate': data?.createdOn || new Date(),
                    'lastModifiedBy': data?.updatedBy || '',
                    'lastModifiedDate': data?.updatedOn || new Date()
                }
            }
        }
    }

    // Helper function to handle indexing of create/update/delete data to search microservice
    public manageSearchIndex ( data: any, mode: string ) {
        let query: string = `
                mutation ManageIndex($input: SearchInput, $mode: String!) {
                    manageIndex(input: $input, mode: $mode) {
                        status
                    }
                }
            `;
        return fetch( `${ process.env.API_GATEWAY }`, {
            method: `POST`,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${ process.env.GATEWAY_AUTH_TOKEN }`
            },
            body: JSON.stringify({
                query: query,
                variables: {
                    input: mode === 'index'? data?.input : data,
                    mode
                }
            } ),
        } ).then( ( response: any ) => response.json())
            .then( ( result: any ) => {
                const succesStatusCodes = [ 200, 204 ];
                if ( succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Sucessfully completed the index updation.')
                } else if ( !succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Error in index updation.');
                }
            })
            .catch((err: Error) => {
                throw err;
            });
    }
}

export const UserGroupAPIHelper = UserGroupApiHelper.getApiInstance();
