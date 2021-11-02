import fetch from 'cross-fetch';
import Logger from '../lib/logger';
import { COUCHDB_ADMIN_TOKEN, COUCHDB_ENDPOINT } from '../setup/env';

const headers = {
  'Content-Type': 'appliceation/json',
  Authorization: COUCHDB_ADMIN_TOKEN,
};

async function handleResponse(res: Response) {
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
}

function handleError(err: any) {
  Logger.debug(err);
  if (err instanceof Error) {
    throw new Error(err.message);
  } else {
    throw err;
  }
}

export async function createDatabase(databaseName: string) {
  return fetch(`${COUCHDB_ENDPOINT}/${databaseName}`, {
    method: 'PUT',
    headers,
  })
    .then(handleResponse)
    .catch(handleError);
}

export async function deleteDatabase(databaseName: string) {
  return fetch(`${COUCHDB_ENDPOINT}/${databaseName}`, {
    method: 'DELETE',
    headers,
  })
    .then(handleResponse)
    .catch(handleError);
}

interface ICouchDBPermissions {
  admins: string[];
  users: string[];
}
export async function setDatabasePermissions(databaseName: string, {
  admins,
  users,
}: ICouchDBPermissions) {
  return fetch(`${COUCHDB_ENDPOINT}/${databaseName}/_security`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      admins: {
        roles: [
          '_admin',
          ...admins.filter((uid, index, arr) => arr.indexOf(uid) === index && uid !== '_admin'),
        ],
      },
      users: {
        roles: [
          '_admin',
          ...users.filter((uid, index, arr) => arr.indexOf(uid) === index && uid !== '_admin'),
        ],
      },
    }),
  })
    .then(handleResponse)
    .catch(handleError);
}
