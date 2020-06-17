import gql from 'graphql-tag';

const homeFragment = gql`
fragment home on HomeType {
  _id
  name
  entityType
  permissions {
    role
    roverGroup
  }
}
`;
export const updateHomeType = gql`
${homeFragment}
mutation UpdateHomeType ($input: HomeInput) {
  updateHomeType(input: $input) {
    ...home
  }
}
`;
export const getHomeTypeByUser = gql`
${homeFragment}
query GetHomeTypeByUser ($rhuuid: String!) {
  getHomeTypeByUser(rhuuid: $rhuuid) {
    ...home
  }
}
`;
export const getUsersBy = gql`
query GetUsersBy ($rhuuid: String!) {
  getUsersBy(rhatUUID: $rhuuid) {
    _id
    name
    rhatUUID
    memberOf
    uid
    apiRole
    title
  }
}`;
