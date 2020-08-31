import * as _ from 'lodash';
const fetch = require( 'node-fetch' );
import https from 'https';

import { HttpsProxyAgent } from 'https-proxy-agent';
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
            headers.append( `Authorization`, `${ process.env.AUTH_TOKEN }` );
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            try {
                return fetch( `${ process.env.HYDRA_API }/index`, {
                    method: `POST`,
                    headers,
                    body: JSON.stringify( body),
                    agent: new HttpsProxyAgent( `${ process.env.AKAMAI_API }` ),
                } ).then( ( response: SearchResponseCode ) => resolve( { status: response.status } ) );
            } catch ( err ) {
                console.log( err );
                reject(err)
            }
        } );
    }

    public delete ( body: any ) {
        return new Promise( async ( resolve, reject ) => {
            let headers = new Headers();
            headers.append( `Authorization`, `${ process.env.AUTH_TOKEN }` );
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            console.log( `${ process.env.HYDRA_API }/delete` );
            try {
                return fetch( `${ process.env.HYDRA_API }/delete`, {
                    method: `DELETE`,
                    headers,
                    body: JSON.stringify( body ),
                    agent: new HttpsProxyAgent( `${ process.env.AKAMAI_API }` ),
                } ).then( ( response: SearchResponseCode ) => resolve( { status: response.status } ) );
            } catch ( err ) {
                console.log( err );
                reject( err );
            }
        } );
    }

    public search ( params: any ) {
        return new Promise( async ( resolve, reject ) => {
            let headers = new Headers();
            headers.append( `Authorization`, `${ process.env.AUTH_TOKEN }` );
            headers.append( `Content-Type`, `application/json` );
            headers.append( `Accept`, `application/json` );
            try {
                const httpsAgent = new https.Agent( {
                    rejectUnauthorized: false,
                } );
                return fetch( `${ process.env.SEARCH_API }?q=${ params.query }&start=${ params.start }&rows=${ params.rows }&sort=timestamp desc`, {
                    method: `GET`,
                    headers,
                    agent: httpsAgent
                } ).then( ( response: any ) => response.json() )
                    .then( async ( result: SearchResponseType ) => {
                         result.response.docs = result?.response?.docs.map( ( doc: any ) => {
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
