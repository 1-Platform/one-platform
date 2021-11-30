import { createClient } from '@urql/core';
import fetch from 'cross-fetch';
import { API_GATEWAY, GATEWAY_AUTH_TOKEN } from '../setup/env';
import getUserQuery from '../utils/gql-queries/getUser';

export const client = createClient({
  url: API_GATEWAY,
  fetch,
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
      Authorization: GATEWAY_AUTH_TOKEN,
    },
  },
});

export async function getUser(uuid: string) {
  return client
    .query(getUserQuery, { uuid })
    .toPromise()
    .then((res) => res.data.getUsersBy?.[0]);
}
