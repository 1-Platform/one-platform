import { gql } from '@urql/core';

const getUserQuery = gql`
query ($uuid: String!) {
  getUsersBy(rhatUUID: $uuid) {
    name: cn
    email: mail
    uuid: rhatUUID
  }
}
`;

export default getUserQuery;
