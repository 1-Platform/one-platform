import { ApolloServer } from 'apollo-server-fastify';

import { graphqlSchema } from '../app';
import { Analytics } from '../db/analytics';
import { AnalyticsConfig } from '../datasource/analyticConfigDB';

import {
  mockConfig,
  sentryMockProjects,
  sentryMockProjectStats,
  sentryMockTeam,
  userData,
} from './mocks/data';
import { disconnectMockDatabase, setupMockDatabase } from './mocks/mockDatabase';
import {
  createAnalyticsConfigMutation,
  getAnalyticsConfigByAppId,
  getCrashlyticStats,
  getSentryProjects,
  getSentryTeams,
  listAnalyticsConfigQuery,
} from './query.gql';

let server: ApolloServer;

const analyticsConfig = new AnalyticsConfig(Analytics);
const sentryAPI = {
  createAProject: jest.fn(),
  getAProjectClientKeys: jest.fn(() => Promise.resolve({ body: [{ dsn: { public: 'dsn-key' } }] })),
  getTeams: jest.fn(() => Promise.resolve({ body: [sentryMockTeam] })),
  getProjects: jest.fn(() => Promise.resolve({ body: sentryMockProjects })),
  getProjectStats: jest.fn(() => Promise.resolve({ body: sentryMockProjectStats })),
  getAProject: jest.fn(() => Promise.resolve({ body: sentryMockProjects[0] })),
};

const userId = 'some-user-id';
beforeAll(async () => {
  await setupMockDatabase();
});
afterAll(async () => {
  await disconnectMockDatabase();
});

const context = { loaders: { user: jest.fn().mockReturnValue(userData) }, user: { id: userId } };

beforeEach(() => {
  server = new ApolloServer({
    schema: graphqlSchema,
    context,
    dataSources: () => {
      return {
        analyticsConfig,
        sentryAPI: sentryAPI as any,
      };
    },
  });
});

describe('Apps queries and mutation', () => {
  it('should create a config', async () => {
    const result = await server.executeOperation({
      query: createAnalyticsConfigMutation,
      variables: {
        config: {
          appId: 'akhilmhdh',
          sentryPlatform: 'javascript-react',
          sentryTeamId: 'one-platform',
          sentryProjectId: 'test',
        },
      },
    });

    expect(result.errors).toBeUndefined();
    // mongodb id
    const id = result.data?.createAnalyticsConfig.id;
    expect(result.data?.createAnalyticsConfig).toEqual({
      id,
      ...mockConfig,
    });
  });

  it('should list configs', async () => {
    const result = await server.executeOperation({
      query: listAnalyticsConfigQuery,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data?.listAnalyticsConfigs.length).toBeGreaterThanOrEqual(1);
    result.data?.listAnalyticsConfigs.forEach((config: any) => {
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('appId');
      expect(config).toHaveProperty('sentryTeamId');
      expect(config).toHaveProperty('sentryProjectId');
    });
  });

  it('should get config by appId', async () => {
    const result = await server.executeOperation({
      query: getAnalyticsConfigByAppId,
      variables: {
        appId: 'akhilmhdh',
      },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.getAnalyticsConfigByAppId).toEqual(mockConfig);
  });

  it('should get sentry project list', async () => {
    const result = await server.executeOperation({
      query: getSentryProjects,
      variables: {
        teamId: 'one-platform',
      },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.getSentryProjects).toEqual(sentryMockProjects);
  });

  it('should get sentry team list', async () => {
    const result = await server.executeOperation({
      query: getSentryTeams,
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.getSentryTeams).toEqual([sentryMockTeam]);
  });

  it('should get sentry project stats', async () => {
    const result = await server.executeOperation({
      query: getCrashlyticStats,
      variables: {
        appId: 'akhilmhdh',
        config: {
          groupBy: 'CATEGORY',
          field: 'QUANTITY',
          start: '2022-04-06T00:00:00Z',
          end: '2022-04-19T00:00:00Z',
          interval: '1d',
        },
      },
    });
    expect(result.errors).toBeUndefined();
    expect(result.data?.getCrashlyticStats).toEqual({
      start: '2022-03-21T07:00:00Z',
      end: '2022-03-21T08:00:00Z',
      intervals: ['2022-03-21T07:00:00Z', '2022-03-21T08:00:00Z'],
      total: 10,
      series: [0, 10],
    });
  });
});
