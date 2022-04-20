export const createAnalyticsConfigMutation = /* GraphQL */ `
  mutation ($config: CreateAnalyticsConfigInput!) {
    createAnalyticsConfig(config: $config) {
      id
      appId
      sentryTeamId
      sentryProjectId
      sentryDSN
    }
  }
`;

export const listAnalyticsConfigQuery = /* GraphQL */ `
  query ListAnalyticsConfigs {
    listAnalyticsConfigs {
      id
      appId
      sentryTeamId
      sentryProjectId
    }
  }
`;

export const getAnalyticsConfigByAppId = /* GraphQL */ `
  query Query($appId: String!) {
    getAnalyticsConfigByAppId(appId: $appId) {
      appId
      sentryTeamId
      sentryProjectId
      sentryDSN
    }
  }
`;

export const getSentryProjects = /* GraphQL */ `
  query GetSentryProjects($teamId: ID!) {
    getSentryProjects(teamId: $teamId) {
      id
      name
      slug
      platform
      team {
        id
        slug
        name
      }
    }
  }
`;

export const getSentryTeams = /* GraphQL */ `
  query GetSentryTeams {
    getSentryTeams {
      id
      slug
      name
    }
  }
`;

export const getCrashlyticStats = /* GraphQL */ `
  query GetCrashlyticStats($appId: String!, $config: CrashlyticOptionInput!) {
    getCrashlyticStats(appId: $appId, config: $config) {
      start
      end
      intervals
      series
      total
    }
  }
`;
