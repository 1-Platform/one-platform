export const addGroup = /* GraphQL */`
  mutation AddGroup( $group: AddGroupInput! ) {
    addGroup(payload: $group) {
      _id
      name
      ldapCommonName
    }
  }
`;

export const getGroupsBy = /* GraphQL */`
  query GetGroupsBy( $selector: GetGroupInput! ) {
    getGroupsBy(selector: $selector) {
      _id
      name
      ldapCommonName
      createdOn
      updatedOn
    }
  }
`;

export const getGroupDetailsByCn = /* GraphQL */`
  query GetGroupDetailsBy ( $ldapCommonName: String ) {
    group: getGroupsBy(selector: { ldapCommonName: $ldapCommonName }) {
      _id
      name
      ldapCommonName
      createdOn
      updatedOn
    }
    members: getGroupMembers( cn: $ldapCommonName ) {
      cn
      uid
      rhatUUID
    }
  }
`;

export const listGroups = /* GraphQL */`
  query ListGroups {
    listGroups(limit: -1) {
      _id
      name
      ldapCommonName
      createdOn
      updatedOn
    }
  }
`;

export const updateGroup = /* GraphQL */`
  mutation UpdateGroup($id: ID!, $group: UpdateGroupInput!) {
    updateGroup(id: $id, payload: $group) {
      _id
      name
      ldapCommonName
      createdOn
      updatedOn
    }
  }
`;

export const deleteGroup = /* GraphQL */`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id) {
      _id
      name
      ldapCommonName
    }
  }
`;
