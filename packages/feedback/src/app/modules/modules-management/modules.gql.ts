import gql from 'graphql-tag';

export const listModules = gql`
query listModules {
  listModules {
    _id
    name
    description
    path
    supportedFeatures
    enableModuleSelection
    category
    parent {
      _id
      name
      path
    }
    owner {
      kerberosID
      name
      email
    }
    references {
      userGuide
      videoLink
    }
    timestamp {
      createdAt
      createdBy {
        kerberosID
        name
        email
      }
      modifiedBy {
        kerberosID
        name
        email
      }
      modifiedAt
    }
  }
}
`;

export const getModule = gql`
query getModule($_id: String!) {
  getModule(_id: $_id) {
    _id
    name
    description
    path
    supportedFeatures
    enableModuleSelection
    category
    parent {
      _id
      name
      path
    }
    owner {
      kerberosID
      name
      email
    }
    references {
      userGuide
      videoLink
    }
    timestamp {
      createdAt
      createdBy {
        kerberosID
        name
        email
      }
      modifiedBy {
        kerberosID
        name
        email
      }
      modifiedAt
    }
  }
}
`;

export const addModule = gql`
mutation addModule (
  $input: ModuleInput
  ) {
    addModule (
      input: $input
      ) {
        _id
        name
        category
        description
        path
        supportedFeatures
        enableModuleSelection
        owner {
          kerberosID
          name
          email
        }
        references {
          userGuide
          videoLink
        }
        parent
        timestamp {
          createdAt
          createdBy {
            kerberosID
            name
            email
          }
          modifiedAt
          modifiedBy {
            kerberosID
            name
            email
          }
        }
        }
    }
`;

export const updateModule = gql`
mutation updateModule (
  $input: ModuleInput
  ) {
    updateModule (
      input: $input
      ) {
        _id
        name
        category
        description
        path
        supportedFeatures
        enableModuleSelection
        owner {
          kerberosID
          name
          email
        }
        references {
          userGuide
          videoLink
        }
        parent
        timestamp {
          createdAt
          createdBy {
            kerberosID
            name
            email
          }
          modifiedAt
          modifiedBy {
            kerberosID
            name
            email
          }
        }
        }
    }
`;

export const deleteModule = gql`
  mutation deleteModule($_id: String!) {
    deleteModule(_id: $_id) {
      _id
    }
  }
`;

export const getModulesByName = gql`
query getModulesBy($input: ModuleInput) {
  getModulesBy(input: $input) {
    _id
    name
    description
    path
  }
}
`;
