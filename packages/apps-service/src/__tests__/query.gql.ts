export const createAppMutation = /* GraphQL */ `
  mutation ($app: CreateAppInput!) {
    createApp (app: $app) {
      id
      appId
      name
      path
      isActive
      ownerId
      createdBy
      createdOn
    }
  }
`;

export const appsQuery = /* GraphQL */`
  query {
    apps {
      id
      appId
      name
    }
  }
`;

export const myAppsQuery = /* GraphQL */`
  query {
    myApps {
      id
      appId
      name
      ownerId
    }
  }
`;

export const appByIdQuery = /* GraphQL */ `
  query ($id: ID) {
    app(id: $id) {
      id
      appId
      name
    }
  }
`;

export const appByAppIdQuery = /* GraphQL */ `
  query ($appId: String) {
    app(appId: $appId) {
      id
      appId
      name
    }
  }
`;

export const updateAppMutation = /* GraphQL */ `
  mutation ($id: ID!, $app: UpdateAppInput!) {
    updateApp(id: $id, app: $app) {
      id
      appId
      name
      path
      description
    }
  }
`;

export const findAppsQuery = /* GraphQL */`
  query ($selectors: FindAppInput!) {
    findApps (selectors: $selectors) {
      id
      appId
      name
      path
    }
  }
`;

export const transferAppOwnershipMutation = /* GraphQL */`
  mutation ($id: ID!, $ownerId: String!) {
    transferAppOwnership (id: $id, ownerId: $ownerId) {
      id
      appId
      ownerId
    }
  }
`;

export const deleteAppMutation = /* GraphQL */`
  mutation ($id: ID!) {
    deleteApp (id: $id) {
      id
      appId
    }
  }
`;
