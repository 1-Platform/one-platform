export const searchUsers = /* GraphQL */`
  query ($uid: String!) {
    users: searchRoverUsers(ldapfield: uid, value: $uid, cacheUser: true) {
      uid
      name: cn
      email: mail
      id: rhatUUID
    }
  }
`;
