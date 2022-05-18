export const buildUserQuery = (userIds: readonly string[]) => {
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
