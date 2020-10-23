import JWT from 'jsonwebtoken';
import { fetch } from 'cross-fetch';
import { microservices } from './stitch-schema';

/* Function to fetch the public key from internal IDP */
const formatAsPem = (str: any) => {
  const keyHeader = '-----BEGIN PUBLIC KEY-----';
  const keyFooter = '-----END PUBLIC KEY-----';
  let formatKey = '';
  if ( str.startsWith( keyHeader ) && str.endsWith( keyFooter ) ) {
    return str;
  }

  if ( str.split( '\n' ).length === 1 ) {
    while ( str.length > 0 ) {
      formatKey += `${ str.substring( 0, 64 ) }\n`;
      str = str.substring( 64 );
    }
  }

  return `${ keyHeader }\n${ formatKey }${ keyFooter }`;
};

export function getPublicKey(): string {
  const publicKey = process.env.KEYCLOAK_PUBKEY;

  if ( publicKey && publicKey.trim().length > 0 ) {
    return formatAsPem( publicKey );
  }
  throw Error( 'No Keycloak Public Key found! Please configure it by setting the KEYCLOAK_PUBKEY environment variable.' );
}

/**
 * Verifies the JWT Token
 */
export function verifyJwtToken ( token: string, callback: any ) {
  return JWT.verify( token, getPublicKey(), callback );
}

/**
 * Verifies the API Key
 */
export function verifyAPIKey ( accessToken: string ) {
  const userGroupAPI = microservices.find( service => service.name === 'User Group' );
  if ( !userGroupAPI ) {
    throw new Error( 'API Key Config error. User Group not configured properly.' );
  }

  return fetch( userGroupAPI.uri, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify( {
      query: /* GraphQL */`
        query ValidateAPIKey($accessToken: String!) {
          apiKey: validateAPIKey(accessToken: $accessToken) {
            _id
            access {
              role
              microservice
            }
          }
        }
      `,
      variables: { accessToken }
    } )
  } )
    .then( res => res.json())
    .then( res => {
      if ( res.errors ) {
        throw new Error( res.errors.map( ( { message }: any ) => message ).join( ', ' ) );
      }
      return res.data.apiKey;
    } );
}
