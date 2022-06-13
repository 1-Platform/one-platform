import DataLoader from 'dataloader';
import { request } from 'undici';

const buildUserQuery = (userIds: readonly string[]) => {
  let queryParams = '';
  userIds.forEach((userId: string) => {
    queryParams = queryParams.concat(`
            rhatUUID_${(userId as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${userId}") {
                  cn
                  mail
                  uid
                  rhatUUID
                  rhatJobTitle
                }
            `);
  });
  return `query GetUserBy {
            ${queryParams}
        }`;
};

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

    const users = (await req.body.json()) as { data: Record<string, [IUser]> };

    const userMap = Object.keys(users.data).reduce<Record<string, IUser>>((usersDetails, key) => {
      const userData = users.data[key]?.[0];
      if (!userData) return usersDetails;
      return { ...usersDetails, [userData.rhatUUID]: userData };
    }, {});

    return keys.map((id) => userMap?.[id] || null);
  });

  return loader;
};
