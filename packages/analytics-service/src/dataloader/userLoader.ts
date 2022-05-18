import DataLoader from 'dataloader';
import { request } from 'undici';

import { buildUserQuery } from '../helpers';

export const setupUserDataLoader = (apiGatewayURL: string, token: string) => {
  const loader = new DataLoader(async (keys: readonly string[]) => {
    const body = JSON.stringify({ query: buildUserQuery(keys), variables: null });

    const req = await request(apiGatewayURL, {
      body,
      headers: {
        Authorization: token,
        'content-type': 'application/json',
      },
      method: 'POST',
    });

    const users = (await req.body.json()) as { data: Record<string, [User]> };
    const userMap = Object.keys(users.data).reduce<Record<string, User>>((usersDetails, key) => {
      const userData = users.data[key][0];
      return { ...usersDetails, [userData.rhatUUID]: userData };
    }, {});

    return keys.map((id) => userMap[id]);
  });

  return loader;
};
