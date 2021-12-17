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
