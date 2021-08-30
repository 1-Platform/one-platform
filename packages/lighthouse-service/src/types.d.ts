declare module "*.graphql";
declare module "*.json";

type LighthouseType = {
  sites: string;
  serverBaseUrl: string;
  currentBranch: string;
  authorName: string;
  authorEmail: string;
  buildToken: string;
  commitMessage: string;
  preset: string;
};

type LighthouseScoreType = {
  performance: string;
  accessibility: string;
  bestPractices: string;
  seo: string;
  pwa: string;
};

type LighthouseProjectType = {
  id: string;
  name: string;
  slug: string;
  externalUrl: string;
  token: string;
  baseBranch: string;
  createdAt: string;
  updatedAt: string;
};

type UserProfileType = {
  cn: string;
  uid: string;
  rhatUUID: string;
  mail: string;
};

type AppType = {
  _id?: any;
  id?: string;
  name: string;
  branch: string;
};

type PropertyType = {
  _id?: any;
  name: string;
  description: string;
  projectId: string;
  apps: AppType[];
  createdBy: string | UserProfileType;
  createdOn: string;
  updatedOn: string;
  updatedBy: string | UserProfileType;
};

type LHSpaConfigType = {
  _id?: any;
  projectId: string;
  branch: string;
  appId: string;
  createdBy: string | UserProfileType | {};
  createdOn: string;
  updatedOn: string;
  updatedBy: string | UserProfileType | {};
};
