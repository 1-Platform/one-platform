type Properties = {
  name: string;
  id: string;
  projectId: string;
  apps: PropertyApps[];
};

type PropertyApps = {
  id: string;
  name: string;
  branch: string;
};

type Score = {
  pwa: number;
  accessibility: number;
  seo: number;
  bestPractices: number;
  performance: number;
};

type PropertyBuilds = {
  id: string;
  projectId: string;
  score: Score[];
};

type CardScore = {
  name: keyof Score;
  label: string;
  score: number;
};
