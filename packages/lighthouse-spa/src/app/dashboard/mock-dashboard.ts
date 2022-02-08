export const mockListProjects = {
  listLHProjects: {
    count: 1,
    rows: [
      {
        id: 1,
        name: 'one-platform',
      },
    ],
  },
};

export const mockListProjectBranches = {
  listLHProjectBranches: {
    count: 1,
    rows: [
      {
        branch: 'one-platform',
      },
    ],
  },
};

export const mockListProjectScores = {
  listLHProjectBuilds: [
    {
      id: 1,
      projectId: 1,
      updatedAt: '16912345',
      score: {
        pwa: 50,
        accessibility: 50,
        seo: 50,
        bestPractices: 50,
        performance: 50,
      },
    },
  ],
};

export const mockLeaderboardData = {
  count: 1,
  rows: [
    {
      score: {
        pwa: 50,
        accessibility: 50,
        seo: 50,
        bestPractices: 50,
        performance: 50,
      },
      rank: 1,
      build: {
        branch: 'main',
      },
      project: {
        name: 'one-platform',
      },
    },
  ],
};

export const mockLeaderboardAPI = {
  listLHLeaderboard: mockLeaderboardData,
  getLHRankingOfABuild: mockLeaderboardData.rows[0],
};

export const mockLeaderboardRows = [
  {
    rowClassName: 'selected-row',
    cells: [
      {
        title: 1,
      },
      {
        title: 'One-platform',
        chipTitle: 'main',
        chipColor: 'blue',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
    ],
  },
];
