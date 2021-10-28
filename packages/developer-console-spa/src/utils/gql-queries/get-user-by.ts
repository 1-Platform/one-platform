export const getUsersBy = /* GraphQL */`
query GetUsersBy($uid: String!) {
  getUsersBy ( uid: $uid ) {
    cn
    rhatUUID
  }
}
`;
