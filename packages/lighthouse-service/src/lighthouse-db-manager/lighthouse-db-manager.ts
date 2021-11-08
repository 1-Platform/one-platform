import { Order, WhereOptions } from 'sequelize/types';
import {
  Op, fn, col, literal,
} from 'sequelize';
import groupBy from 'lodash/groupBy';
import { sequelize } from './sequelize';

import { Build } from './models/build';
import { Project } from './models/project';
import { Statistic } from './models/statistic';

import {
  Pagination,
  ProjectAttributes,
  BuildAttributes,
  LeadboardStatistic,
  LeaderBoardOptions,
} from './types';
import Logger from '../lib/logger';

/**
 * These keys represent the statistic database values for corresponding LH Scores
 */
const DB_SCORE_KEY_TO_LH_KEY: Record<string, keyof LighthouseScoreType> = {
  category_performance_median: 'performance',
  category_pwa_median: 'pwa',
  category_seo_median: 'seo',
  category_accessibility_median: 'accessibility',
  'category_best-practices_median': 'bestPractices',
};

class LighthouseDbManager {
  // const for build attributes
  BUILD_ATTRIBUTES = [
    'id',
    'projectId',
    'branch',
    'runAt',
    'createdAt',
    'updatedAt',
  ];

  constructor() {
    sequelize.authenticate().catch((err:Error) => Logger.error(err));
  }

  async getAllProjects(options?: Pagination) {
    const order = [['createdAt', 'DESC']] as Order;
    // sequelize filter
    const where: WhereOptions<ProjectAttributes> = {};
    if (options?.search) {
      where.name = { [Op.iLike]: `%${options.search}%` };
    }

    return Project.findAndCountAll({
      raw: true,
      order,
      limit: options?.limit || 1000,
      offset: options?.offset || 0,
      where,
    });
  }

  async getAllBuilds(projectId: string, branch: string, limit: number) {
    const order = [['branch', 'DESC']] as Order;
    return Build.findAll({
      where: { projectId, branch },
      limit,
      order,
      attributes: this.BUILD_ATTRIBUTES,
    });
  }

  async getAllBranches(projectId: string, options?: Pagination) {
    const order = [['branch', 'DESC']] as Order;
    // sequelize filter
    const where: WhereOptions<BuildAttributes> = { projectId };
    if (options?.search) {
      where.branch = { [Op.iLike]: `%${options.search}%` };
    }
    // findAllAncCount won't work on groupBy clause
    const count = await Build.count({
      where,
      attributes: undefined,
      distinct: true,
      col: 'branch',
    });
    /**
     * Branch is formed from the CI CD pipeline
     * To get branches we group branch property of a build
     */
    const rows = await Build.findAll({
      raw: true,
      order,
      limit: options?.limit || 1000,
      offset: options?.offset || 0,
      where,
      group: ['branch'],
      attributes: ['branch'],
    });
    return { count, rows };
  }

  async getLHScores(projectId: string, buildIds: string[]) {
    /**
     * On passing multiple builds the filter from
     * checking as pk is changed to sql in operator
     */
    const buildFilter = buildIds.length <= 1 ? buildIds[0] : { [Op.in]: buildIds };

    /**
     * scores are fetched with
     * GROUPING : ["buildId","name"] and value is averaged
     * Thus gives LH average score of all properties from DB itself
     */
    const stats = await Statistic.findAll({
      raw: true,
      where: {
        projectId,
        buildId: buildFilter,
        name: {
          [Op.or]: [
            'category_performance_median',
            'category_pwa_median',
            'category_seo_median',
            'category_accessibility_median',
            'category_best-practices_median',
          ],
        },
      },
      group: ['buildId', 'name'],
      attributes: ['name', [fn('AVG', col('value')), 'value'], 'buildId'],
    });

    const lhScoreGroupByBuildId: Record<string, LighthouseScoreType> = {};

    stats.forEach((stat) => {
      const key = DB_SCORE_KEY_TO_LH_KEY[stat.name];
      const score = Math.min(Math.round(stat.value * 100), 100); // convert to percentage

      if (lhScoreGroupByBuildId?.[stat.buildId]) {
        lhScoreGroupByBuildId[stat.buildId][key] = score;
      } else {
        lhScoreGroupByBuildId[stat.buildId] = {
          [key]: score,
        } as LighthouseScoreType;
      }
    });
    return lhScoreGroupByBuildId;
  }

  async getLeaderBoard({
    limit = 10,
    offset = 0,
    sort = 'DESC',
    type = 'category_seo_median',
  }: LeaderBoardOptions = {}) {
    /**
     * LOGIC: Leaderboard ranks projects by various category like PWA, SEO etc
     * So the statistic model of LH contains scores for a build's various url
     * We find the score of a build with  SQL AVG operation of all URL
     * The order it accordingly
     * We also use the field createdAt second ordering acting as tie breaker
     */
    const stats = (await Statistic.findAll({
      raw: true,
      group: ['buildId', 'projectId'],
      attributes: [
        'projectId',
        'buildId',
        [fn('AVG', col('value')), 'score'],
        [literal('(RANK() OVER (ORDER BY AVG(value) DESC))'), 'rank'],
      ],
      limit,
      offset,
      where: {
        name: type,
      },
      order: [
        [fn('AVG', col('value')), sort],
        [fn('max', col('createdAt')), 'DESC'],
      ],
    })) as unknown as LeadboardStatistic[]; // sequilize ts-issue on groupby to solve this ts interconvertion of tyoe

    const count = await Statistic.count({
      where: {
        name: type,
      },
      attributes: undefined,
      distinct: true,
      col: 'buildId',
    });

    /**
     * Lighthouse model's contain only the reference key between each other and not foreign key
     * Therefore we cannot apply any kind of operations like JOIN or subquery as there exist no
     * association between the models.
     * Thus we need to make an additional two calls to build and project model to get there details
     */
    const buildIds = stats.map((stat) => stat.buildId);
    const builds = await Build.findAll({
      raw: true,
      where: {
        id: {
          [Op.in]: buildIds,
        },
      },
      attributes: this.BUILD_ATTRIBUTES,
    });

    const uniqueProjectIds: Record<string, boolean> = {};
    const projectIds = builds.reduce((ids, build) => {
      if (!uniqueProjectIds?.[build.projectId]) ids.push(build.projectId);
      return ids;
    }, [] as string[]);

    const projects = await Project.findAll({
      raw: true,
      where: {
        id: {
          [Op.in]: projectIds,
        },
      },
    });

    const projectsGroupedById = groupBy(projects, 'id');
    const buildsGroupedById = groupBy(builds, 'id');

    stats.forEach((stat) => {
      stat.score = Math.min(Math.round(stat.score * 100), 100);
      stat.build = buildsGroupedById[stat.buildId][0] as any;
      stat.project = projectsGroupedById[stat.projectId][0] as any;
    });

    return { count, rows: stats };
  }
}

export const lhDbManager = new LighthouseDbManager();

Object.freeze(lhDbManager);
