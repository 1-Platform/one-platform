export const mockLeaderboard = {
  count: 1,
  rows: [
    {
      score: 50,
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
  data: {
    listLHLeaderboard: mockLeaderboard,
  },
  loading: false,
};
