export const addGroup = /* GraphQL */`
  mutation AddGroup( $group: AddGroupInput! ) {
    addGroup(payload: $group) {
      _id
      name
      cn
    }
  }
`;

export const getGroupsBy = /* GraphQL */`
  query GetGroupsBy( $selector: GetGroupInput! ) {
    getGroupsBy(selector: $selector) {
      _id
      name
      cn
      createdOn
      updatedOn
    }
  }
`;

export const getGroupDetailsByCn = /* GraphQL */ `
  query GetGroupDetailsBy($cn: String!) {
    group: group(cn: $cn) {
      _id
      name
      cn
      createdOn
      updatedOn
      members {
        cn
        uid
      }
    }
  }
`;

export const listGroups = /* GraphQL */`
  query ListGroups {
    listGroups {
      _id
      name
      cn
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
      cn
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
      cn
    }
  }
`;
