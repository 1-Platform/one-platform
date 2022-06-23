type LHProject = {
  id: string;
  name: string;
  slug: string;
  externalUrl: string;
  token: string;
  baseBranch: string;
  createdAt: string;
  updatedAt: string;
};

type Pagination<T extends unknown> = {
  count: number;
  rows: T;
};

type ProjectBranch = {
  id: string;
  branch: string;
  projectId: string;
  updatedAt: string;
  score: Score | null;
};

type Score = {
  pwa: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  performance: number;
};

type ScoreTimelineChart = {
  data: {
    name: string;
    series: ChartDataType[];
  }[];
};

type ChartDataType = {
  name: string;
  value: number;
};

type Card = {
  data: {
    updatedAt: string;
  };
  scores: CardScore[];
};

type CardScore = {
  name: keyof Score;
  label: string;
  score: number;
};

type ExportLHReport = {
  name: string;
  branch: string;
  buildId: string;
  category: string;
  value: number;
  url: string;
  createdAt: string;
};
