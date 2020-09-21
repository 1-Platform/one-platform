import * as _ from 'lodash';
const fetch = require( 'node-fetch' );

global.Headers = fetch.Headers;

class IndexHelper {
    private static UserGroupHelperInstance: IndexHelper;
    constructor () { }
    public static indexHelper () {
        if ( !IndexHelper.UserGroupHelperInstance ) {
            IndexHelper.UserGroupHelperInstance = new IndexHelper();
        }
        return IndexHelper.UserGroupHelperInstance;
    }

    public index ( body: any ) {
        return new Promise( async ( resolve, reject ) => {
            let headers = new Headers();
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            try {
                return fetch( `${ process.env.SOLR_API }/rs/index`, {
                    method: `POST`,
                    headers,
                    body: JSON.stringify( body),
                } ).then( ( response: SearchResponseCode ) => resolve( { status: response.status } ));
            } catch ( err ) {
                console.log( err );
                reject(err)
            }
        } );
    }

    public delete ( body: any ) {
        return new Promise( async ( resolve, reject ) => {
            let headers = new Headers();
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            try {
                const data = `{
                    'data_source': 'oneportal',
                    'documents': [
                       {
                          'solr_command':'delete',
                          'content_type':'oneportal',
                          'id': ${ body }
                       }
                    ]
                 }`
                return fetch( `${ process.env.SOLR_API }/rs/index`, {
                    method: `POST`,
                    headers,
                    body: data,
                } ).then( ( response: SearchResponseCode ) => resolve( { status: response.status } ));
            } catch ( err ) {
                console.log( err );
                reject( err );
            }
        } );
    }

    public search ( params: any ) {
        return new Promise( async ( resolve, reject ) => {
            let headers = new Headers();
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            try {
                return fetch( `${ process.env.SOLR_API }/rs/search/platform/oneportal?q=${ params.query }&start=${ params.start }&rows=${ params.rows }&sort=timestamp desc`, {
                    method: `GET`,
                    headers,
                } ).then( ( response: any ) => response.json() )
                    .then( async ( result: SearchResponseType ) => {
                         result.response.docs = result?.response?.docs?.map( ( doc: any ) => {
                             Object.keys( doc ).forEach( ( key ) => {
                                 if ( key !== 'tags' ) {
                                     doc[ key ] = doc[ key ].toString();
                                 }
                             } );
                             return doc;
                         } ) || [];
                        resolve( result );
                })
            } catch ( err ) {
                console.log( err );
                reject( err );
            }
        } );
    }
}

export const SearchIndexHelper = IndexHelper.indexHelper();
