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

export const listUsers = gql`
  query {
    listUsers {
      _id
      name
      title
      apiRole
      memberOf
    }
  }
`;
