import { createHash } from 'crypto';
const fetch = require( 'node-fetch' );
import { createTransport } from 'nodemailer';
import { API_GATEWAY, GATEWAY_AUTH_TOKEN, SMTP_HOST } from '../setup/env';
( global as any ).Headers = fetch.Headers;


class APICatalogHelper {
    private static APICatalogHelperInstance: APICatalogHelper;
    constructor () { }
    public static apiCatalogHelper () {
        if ( !APICatalogHelper.APICatalogHelperInstance ) {
            APICatalogHelper.APICatalogHelperInstance = new APICatalogHelper();
        }
        return APICatalogHelper.APICatalogHelperInstance;
    }

    buildUserQuery ( userIds: string[] ) {
        let queryParams = '';
        userIds.map( ( userId: string ) => {
            queryParams = queryParams.concat( `
            rhatUUID_${ ( userId as string ).replace( /-/g, '' ) }:getUsersBy(rhatUUID:"${ userId }") {
                  cn
                  mail
                  uid
                  rhatUUID
                }
            `);
        } );
        return `query GetUserBy {
            ${ queryParams }
        }`;
    }

    fetchUserProfile ( query: string ) {
        const headers = new Headers();
        headers.set( 'Content-Type', 'application/json' );
        headers.set( 'Authorization', `${ GATEWAY_AUTH_TOKEN }` );
        const body = JSON.stringify( {
            query,
            variables: null
        } );
        return fetch( API_GATEWAY, {
            method: 'POST',
            headers,
            body: body,
        } ).then( ( response: any ) => response.json() )
            .then( ( result: any ) => Object.keys( result.data ).map( key => result.data[ key ][ 0 ] ) )
            .catch( ( err: Error ) => {
                throw err;
            } );
    }

    introspectionQuery () {
        return `
            query IntrospectionQuery {
            __schema {
                queryType { name }
                mutationType { name }
                subscriptionType { name }
                types {
                ...FullType
                }
                directives {
                name
                description

                locations
                args {
                    ...InputValue
                }
                }
            }
            }
            fragment FullType on __Type {
            kind
            name
            description
            fields(includeDeprecated: true) {
                name
                description
                args {
                ...InputValue
                }
                type {
                ...TypeRef
                }
                isDeprecated
                deprecationReason
            }
            inputFields {
                ...InputValue
            }
            interfaces {
                ...TypeRef
            }
            enumValues(includeDeprecated: true) {
                name
                description
                isDeprecated
                deprecationReason
            }
            possibleTypes {
                ...TypeRef
            }
            }
            fragment InputValue on __InputValue {
            name
            description
            type { ...TypeRef }
            defaultValue
            }
            fragment TypeRef on __Type {
            kind
            name
            ofType {
                kind
                name
                ofType {
                kind
                name
                ofType {
                    kind
                    name
                    ofType {
                    kind
                    name
                    ofType {
                        kind
                        name
                        ofType {
                        kind
                        name
                        ofType {
                            kind
                            name
                        }
                        }
                    }
                    }
                }
                }
            }
            }`;
    }

    async fetchSchema ( category: ApiCategory, environment: EnvironmentType ) {
        const headers = environment.headers?.reduce( ( obj, item ) => Object.assign( obj, { [ ( item as any ).key ]: ( item as any ).value } ), {} ) || {};
        return await fetch( environment.schemaEndpoint, {
            method: ( category === 'GRAPHQL' ) ? 'POST' : 'GET',
            headers,
            body: ( category === 'GRAPHQL' ) ? JSON.stringify( { query: this.introspectionQuery() } ) : null,
        } ).then( ( response: any ) => response.text() )
            .catch( ( err: Error ) => err );
    }

    async manageApiHash ( category: ApiCategory, environment: EnvironmentType ) {
        let apiSchemaResult = await this.fetchSchema( category, environment );
        let parsedGQLSchema;
        if ( category === 'GRAPHQL' ) {
            parsedGQLSchema = JSON.parse( apiSchemaResult );
            ( parsedGQLSchema.extensions ) ? apiSchemaResult = delete parsedGQLSchema.extensions : null;
        }
        return await createHash( 'sha256' ).update( apiSchemaResult ).digest( 'base64' ) || null;
    }

    emailConfig () {
        return createTransport( {
            host: SMTP_HOST,
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            logger: true,
            debug: false
        } );
    }

}
export const apiCatalogHelper = APICatalogHelper.apiCatalogHelper();
