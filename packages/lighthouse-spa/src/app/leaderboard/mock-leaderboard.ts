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
        overall: 50,
      },
      rank: 1,
      branch: 'main',
      project: {
        name: 'one-platform',
      },
    },
  ],
};

export const mockLeaderboardAPI = {
  data: {
    listLHLeaderboard: mockLeaderboardData,
  },
  loading: false,
};

export const mockLeaderboardRows = [
  {
    cells: [
      {
        title: 1,
      },
      {
        title: 'One-platform',
        chipTitle: 'main',
        chipColor: 'gray',
      },
      {
        title: 50,
        "key": "ACCESSIBILITY",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        "key": "BEST_PRACTICES",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        "key": "PERFORMANCE",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        "key": "PWA",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        "key": "SEO",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
      {
        title: 50,
        "key": "OVERALL",
        cellClassName: 'score-avg pf-u-font-weight-bold',
      },
    ],
  },
];
