import fetch, { Response } from 'node-fetch';
import { COUCHDB_ADMIN_TOKEN, COUCHDB_ENDPOINT } from '../setup/env';

const headers = {
  'Content-Type': 'appliceation/json',
  Authorization: COUCHDB_ADMIN_TOKEN,
};

export async function createDatabase ( databaseName: string ) {
  return fetch( COUCHDB_ENDPOINT + '/' + databaseName, {
    method: 'PUT',
    headers,
  } )
    .then( handleResponse )
    .catch( handleError );
}

export async function deleteDatabase ( databaseName: string ) {
  return await fetch( COUCHDB_ENDPOINT + '/' + databaseName, {
    method: 'DELETE',
    headers,
  } )
    .then( handleResponse )
    .catch( handleError );
}

interface ICouchDBPermissions {
  admins: string[];
  users: string[];
}
export async function setDefaultSecurity ( databaseName: string, { admins, users }: ICouchDBPermissions ) {
  return await fetch( COUCHDB_ENDPOINT + '/' + databaseName + '/_security', {
    method: 'PUT',
    headers,
    body: JSON.stringify( {
      admins: {
        roles: [
          '_admin',
          ...admins
        ],
      },
      users: {
        roles: [
          '_admin',
          ...users
        ]
      }
    } )
  } )
    .then( handleResponse )
    .catch( handleError );
}

async function handleResponse ( res: Response ) {
  if ( !res.ok ) {
    throw await res.json();
  }
  return await res.json();
}

function handleError ( err: any ) {
  console.debug( err );
  if ( err instanceof Error ) {
    throw err.message;
  } else {
    throw err;
  }
}
