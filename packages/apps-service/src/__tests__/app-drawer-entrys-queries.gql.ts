export const addAppDrawerEntry = /* GraphQL */ `
  mutation ($projectId: ID!, $appDrawerEntry: NewAppDrawerEntryInput!) {
    addAppDrawerEntry(projectId: $projectId, appDrawerEntry: $appDrawerEntry) {
      projectId
      appId
      label
      path
      authenticate
    }
  }
`;

export const apps = /* GraphQL */ `
  query {
    apps {
      projectId
      appId
      label
      path
      authenticate
    }
  }
`;

export const app = /* GraphQL */ `
  query ($appId: ID!) {
    app(appId: $appId) {
      projectId
      appId
      label
      path
      authenticate
      project {
        projectId
      }
      application {
        appId
      }
    }
  }
`;

export const updateAppDrawerEntry = /* GraphQL */ `
  mutation (
    $projectId: ID!
    $appId: ID!
    $appDrawerEntry: UpdateAppDrawerEntryInput!
  ) {
    updateAppDrawerEntry(
      projectId: $projectId
      appId: $appId
      appDrawerEntry: $appDrawerEntry
    ) {
      projectId
      appId
      label
      path
    }
  }
`;

export const setApplicationAuthentication = /* GraphQL */ `
  mutation ($projectId: ID!, $appId: ID!, $value: Boolean!) {
    setApplicationAuthentication(projectId: $projectId, appId: $appId, value: $value) {
      projectId
      appId
      authenticate
    }
  }
`;

export const deleteAppDrawerEntry = /* GraphQL */ `
  mutation ($projectId: ID!, $appId: ID!) {
    deleteAppDrawerEntry(projectId: $projectId, appId: $appId) {
      projectId
      appId
      label
    }
  }
`;
