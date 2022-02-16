import { Optional, Model } from 'sequelize/types';

export type ProjectAttributes = {
  id: string;
  name: string;
  slug: string;
  externalUrl: string;
  token: string;
  baseBranch: string;
  adminToken: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectCreationModel = Optional<ProjectAttributes, 'id'>;

export type ProjectInstance = Model<ProjectAttributes, ProjectCreationModel> &
ProjectAttributes;

export type BuildAttributes = {
  id: string;
  projectId: string;
  lifecycle: string;
  hash: string;
  branch: string;
  commitMessage: string;
  author: string;
  avatarUrl: string;
  ancestorHash: string;
  externalBuildUrl: string;
  runAt: Date;
  committedAt: Date;
  ancestorCommittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BuildCreationModel = Optional<BuildAttributes, 'id'>;

export type BuildInstance = Model<BuildAttributes, BuildCreationModel> &
BuildAttributes;

export type StatisticAttributes = {
  id: string;
  projectId: string;
  buildId: string;
  version: number;
  url: string;
  name: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
};

export type StatisticCreationModel = Optional<StatisticAttributes, 'id'>;

export type StatisticInstance = Model<
StatisticAttributes,
StatisticCreationModel
> &
StatisticAttributes;

export type Pagination = {
  limit?: number;
  offset?: number;
  search?: string;
};

export type Sort = {
  sort: 'ASC' | 'DESC';
};

export type LeadboardStatistic = {
  score: number | LighthouseScoreType;
  rank: number;
  branch: string;
  projectId: string;
  project: LighthouseProjectType;
  build: LighthouseBuildType;
};

export type LeaderBoardOptions = Pagination &
Optional<Sort, 'sort'> & {
  type?: string;
};

export type BuildLeaderboardRankOption = {
  projectId: string;
  branch: string;
  type?: string;
} & Partial<Sort>;
