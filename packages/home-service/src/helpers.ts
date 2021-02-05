// write your helper functions here
import { RedisPubSub } from 'graphql-redis-subscriptions';
const fetch = require( 'node-fetch' );
import Redis from 'ioredis';
global.Headers = fetch.Headers;
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

class HomeAPIHelper {
  userFragment = `
        fragment user on UserType {
            _id
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }`;
  /**
   * Builds the graphql query according to the owners array in the homeType
   * @param response homeType(array of homeType) database response
   */
  buildGqlQuery ( response: HomeType[] ) {
    return response.map( ( resp: any ) => {
      let query = [];
      if ( resp.owners.length ) {
        query = resp.owners.map( ( rhatUUID: string ) => `owner_${ resp._id }_${ rhatUUID.replace( /-/g, '' ) }:getUsersBy(rhatUUID: "${ rhatUUID }"){ ...user }` );
      }
      if ( !!resp.createdBy ) {
        query.push( `createdBy_${ resp._id }:getUsersBy(rhatUUID: "${ resp.createdBy }"){ ...user }` );
      }
      if ( !!resp.updatedBy ) {
        query.push( `updatedBy_${ resp._id }:getUsersBy(rhatUUID: "${ resp.updatedBy }"){ ...user }` );
      }
      return query;
    } );
  }
  /**
   * Fetches user details from the user-service using node-fetch
   * @param query gql query which would fetch information from the user-service
   */
  getUserDetails ( query: string ) {
    const body = `
            ${this.userFragment }
            query {
                ${query }
        }`;
    return fetch( `http://${ process.env.USER_SERVICE_SERVICE_HOST }:${ process.env.USER_SERVICE_SERVICE_PORT }/graphql`, {
      method: 'post',
      body: JSON.stringify( { query: body } ),
      headers: { 'Content-Type': 'application/json' },
    } )
      .then( ( res: any ) => res.json() );
  }
  /**
   * Replaces the owners array(owners: string[]) with populated HomeUserType (owners: HomeUserType[])
   * @param response Database response
   * @param userDetails UserDetails which are fetched from user-service
   */
  stitchHomeType ( response: HomeType[] | any, userDetails: any ) {
    return response.map( ( data: any ) => {
      if ( userDetails[ `createdBy_${ data._id }` ] ) {
        const resp = { ...data, createdBy: userDetails[ `createdBy_${ data._id }` ][ 0 ] };
        if ( resp.owners.length ) {
          Object.assign(
            resp.owners,
            Object.entries( userDetails ).reduce( ( accumulator: any, user: any ) => {
              if ( user[ 0 ].startsWith( `owner_${ resp._id }` ) ) {
                accumulator.push( ...user[ 1 ] );
              }
              return accumulator;
            }, [] )
          );
        }
        if ( userDetails[ `updatedBy_${ data._id }` ] ) {
          return { ...resp, updatedBy: userDetails[ `updatedBy_${ data._id }` ][ 0 ] };
        }
        return resp;
      }
      return data;
    } );
  }

  // Search Data formatter
  public formatSearchInput(data: any) {
    return {
      'id': data._id,
      'title': data.name,
      'abstract': data.description || '',
      'description': data.description || '',
      'icon': `assets/icons/home.svg`,
      'uri': process.env.CLIENT_URL + data.link,
      'tags': `Home, ${data.name}`,
      'contentType': 'Home',
      'createdBy': data.createdBy?.name || '',
      'createdDate': data?.createdOn || new Date(),
      'lastModifiedBy': data?.updatedBy?.name || '',
      'lastModifiedDate': data?.updatedOn || new Date()
    }
  }

  // Helper function to create/update/delete data to search microservice
  public manageSearchIndex(data: any, mode: string) {
    let query: string = ``;
    if ( mode === 'index') {
      query = `
      mutation ManageIndex($input: SearchInput) {
        manageIndex(input: $input) {
          status
        }
      }
      `;
    } else if( mode === 'delete') {
      query = `
        mutation DeleteIndex($id: String) {
          deleteIndex(id: $id) {
            status
          }
        }      
      `
    }
    let headers = new Headers();
    let body = JSON.stringify({
      query: query,
      variables: data
    });

    headers.append(`Authorization`, `${process.env.GATEWAY_AUTH_TOKEN}`);
    headers.append(`Content-Type`, `application/json`);
    return fetch(`${process.env.API_GATEWAY}`, {
      method: `POST`,
      headers,
      body: body,
    }).then((response: any) => response.json())
      .then((result: any) => {
        if ((result.data?.manageIndex?.status === 200) || (result?.data?.deleteIndex?.status === 204)) {
          console.log('Sucessfully completed the index updation');
          return result.data?.manageIndex?.status || result?.data?.deleteIndex?.status;
        } else if ((result?.data?.manageIndex?.status !== 200) || (result?.data?.deleteIndex?.status !== 204)) {
          console.log("Error in index updation.");
          return result.data?.manageIndex?.status || result?.data?.deleteIndex?.status;
        }
      })
      .catch((err: any) => {
        throw err;
      });
  }

}

export const HomeHelper = new HomeAPIHelper();
