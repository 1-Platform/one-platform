/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Order, WhereOptions } from 'sequelize/types';
import {
  Op, fn, col, QueryTypes,
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
  ProjectInstance,
  BuildLeaderboardRankOption,
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
          [Op.or]: Object.keys(DB_SCORE_KEY_TO_LH_KEY),
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

  async getAllScoreOfBuilds(buildIds: string[]) {
    const leaderboardOtherScores = await Statistic.findAll({
      where: {
        name: { [Op.in]: Object.keys(DB_SCORE_KEY_TO_LH_KEY) },
        buildId: {
          [Op.in]: buildIds,
        },
      },
    });

    return leaderboardOtherScores.reduce<
    Record<string, LighthouseScoreType>
    >((prev, { buildId, value, name }) => {
      const buildScores = prev;
      const roundedValue = Math.min(Math.round(value * 100), 100);

      if (buildId in buildScores) {
        buildScores[buildId][DB_SCORE_KEY_TO_LH_KEY[name]] = roundedValue;
      } else {
        buildScores[buildId] = { [DB_SCORE_KEY_TO_LH_KEY[name]]: roundedValue } as LighthouseScoreType;
      }

      return buildScores;
    }, {});
  }

  /**
   * Statistic table contains all infomation of various type of scores of a build
   * Its stored in key - value model
   * The major issue with lighthouse table is, it uses associate keys rather than foreign keys
   * Thus you cannot use joins to obtains relational ones
   *              -------------------------------------------------
   * There is major two flows one due to search and other not
   * In search (by project name): first projects are fetched then corresponding stats and builds
   * When not using search first stats are taken then build -> projects
   */
  async getLeaderBoard({
    limit = 10,
    offset = 0,
    sort = 'DESC',
    type = 'overall',
    search,
  }: LeaderBoardOptions = {}) {
    // filters that gets added on based on conditions
    let group = [];

    const scoreFieldsDb = Object.keys(DB_SCORE_KEY_TO_LH_KEY);
    const isOveralCategory = type === 'overall';

    let projects: ProjectInstance[] = []; // due to two flows

    if (search) {
      // find projects and then find stats
      projects = await Project.findAll({
        raw: true,
        where: {
          name: { [Op.iLike]: `%${search}%` },
        },
        limit: 10,
      });

      if (!projects.length) {
        return { count: 0, rows: [] };
      }
    }

    /**
     * When category is overall we need to take avg of whole build stats
     * Other ones we need to pick it up key name
     */
    if (isOveralCategory) {
      group = ['buildId', 'projectId'];
    } else {
      group = ['buildId', 'name', 'projectId'];
    }

    /**
     * raw query is used to handle filtering after ranking as sub query is not feasible in orm
     * To avoid sql injection conditionally replacement values are placed and values are injected from replacement
     * Conditions checked
     * 1. When its not overall fetch the name else
     * 2. Groups
     * 3. Sort direction
     * 4. On search to inject projects requried after ranking
     */
    const stats = await sequelize.query(
      `SELECT * FROM (
          SELECT "projectId", "buildId", AVG("value") AS "score",
          (DENSE_RANK() OVER (ORDER BY AVG(value) DESC)) AS "rank" ${isOveralCategory ? '' : ', "name"'}
          FROM "statistics" AS "statistics"
          WHERE "statistics"."name" ${isOveralCategory ? 'IN(:name)' : '= :name'}
          GROUP BY "${group.join('","')}"
          ORDER BY AVG("value") ${sort === 'DESC' ? 'DESC' : 'ASC'}, max("createdAt") ${sort === 'DESC' ? 'DESC' : 'ASC'}
        ) As a
        ${projects.length ? 'where "projectId" IN(:projectId)' : ''}
        LIMIT :limit OFFSET :offset`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          name: isOveralCategory ? scoreFieldsDb : type,
          projectId: projects.map(({ id }) => id),
          limit,
          offset,
        },
        model: Statistic,
        raw: true,
      },
    ) as unknown as LeadboardStatistic[];

    const buildIds = stats
      .map(({ buildId }) => buildId)
      .filter((el) => Boolean(el));

    const leaderBoardScores = await this.getAllScoreOfBuilds(buildIds);

    const count = await Statistic.count({
      attributes: undefined,
      distinct: true,
      col: 'buildId',
      where: search ? {
        projectId: {
          [Op.in]: projects.map(({ id }) => id),
        },
      } : undefined,
    });

    // due to missing relation keys
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

    // if not search flow find the projects
    if (!search) {
      projects = await Project.findAll({
        raw: true,
        where: {
          id: {
            [Op.in]: projectIds,
          },
        },
      });
    }

    const projectsGroupedById = groupBy(projects, 'id');
    const buildsGroupedById = groupBy(builds, 'id');

    stats.forEach((stat) => {
      stat.score = leaderBoardScores[stat.buildId];
      stat.build = buildsGroupedById[stat.buildId][0] as any;
      stat.project = projectsGroupedById[stat.projectId][0] as any;
    });

    return { count, rows: stats };
  }

  // same query as leaderboard but for a particule build
  async getLHRankingOfABuild({
    projectId, buildId, sort = 'DESC',
    type = 'overall',
  }: BuildLeaderboardRankOption) {
    let group = [];

    const isOveralCategory = type === 'overall';
    const scoreFieldsDb = Object.keys(DB_SCORE_KEY_TO_LH_KEY);

    if (isOveralCategory) {
      group = ['buildId', 'projectId'];
    } else {
      group = ['buildId', 'name', 'projectId'];
    }

    const stats = await sequelize.query(
      `SELECT * FROM (
          SELECT "projectId", "buildId", AVG("value") AS "score",
          (DENSE_RANK() OVER (ORDER BY AVG(value) DESC)) AS "rank" ${isOveralCategory ? '' : ', "name"'}
          FROM "statistics" AS "statistics"
          WHERE "statistics"."name" ${isOveralCategory ? 'IN(:name)' : '= :name'}
          GROUP BY "${group.join('","')}"
          ORDER BY AVG("value") ${sort === 'DESC' ? 'DESC' : 'ASC'}, max("createdAt") ${sort === 'DESC' ? 'DESC' : 'ASC'}
        ) As a
        where "projectId" = :projectId AND  "buildId" = :buildId
        LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          projectId,
          buildId,
          name: isOveralCategory ? scoreFieldsDb : type,
        },
        model: Statistic,
        raw: true,
      },
    ) as unknown as LeadboardStatistic[];

    if (!stats.length) {
      throw Error('No stats found');
    }
    const leaderBoardScores = await this.getAllScoreOfBuilds([buildId]);

    const stat = stats[0];
    const build = await Build.findOne({
      raw: true,
      where: {
        id: buildId,
      },
      attributes: this.BUILD_ATTRIBUTES,
    });

    if (!build) {
      throw Error('Build not found');
    }

    const project = await Project.findOne({
      raw: true,
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw Error('Project not found');
    }

    stat.build = build as any;
    stat.project = project as any;
    stat.score = leaderBoardScores[buildId];
    return stat;
  }
}

export const lhDbManager = new LighthouseDbManager();

Object.freeze(lhDbManager);
