export const userData = [
  {
    cn: 'test',
    mail: 'test',
    uid: 'test',
    rhatUUID: 'test',
    rhatJobTitle: 'test',
  },
];

export const sentryMockTeam = {
  id: '1',
  slug: 'one-platform',
  name: 'one-platform',
};

export const sentryMockProjects = [
  {
    id: '1',
    slug: 'test',
    name: 'test',
    platform: 'javescript-react',
    team: sentryMockTeam,
  },
];

export const sentryMockProjectStats = {
  start: '2022-03-21T07:00:00Z',
  end: '2022-03-21T08:00:00Z',
  intervals: ['2022-03-21T07:00:00Z', '2022-03-21T08:00:00Z'],
  groups: [
    {
      by: {
        category: 'error',
      },
      totals: {
        'sum(quantity)': 10,
      },
      series: {
        'sum(quantity)': [0, 10],
      },
    },
  ],
};

export const mockConfig = {
  appId: 'akhilmhdh',
  sentryTeamId: 'one-platform',
  sentryProjectId: 'test',
  sentryDSN: 'dsn-key',
};
