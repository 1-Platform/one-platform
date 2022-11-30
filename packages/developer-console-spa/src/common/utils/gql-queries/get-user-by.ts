export const getUsersBy = /* GraphQL */`
query ($uid: String!) {
  getUsersBy ( uid: $uid ) {
    cn
    rhatUUID
  }
}
`;
