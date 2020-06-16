import gql from 'graphql-tag';

export const addUserFromLDAP = gql`
  mutation addUserFromLDAP($uid: String!) {
    addUserFromLDAP(uid: $uid) {
      _id
      name
      title
      apiRole
    }
  }
`;
const homeFragment = gql`
fragment home on HomeType {
  _id
  name
  entityType
  owners {
    _id
    name
    rhatUUID
  }
  permissions {
    role
    roverGroup
  }
  active
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
