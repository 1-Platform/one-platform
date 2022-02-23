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
  StatisticInstance,
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

  // If there is negative score its clamped to 0
  get getLeaderboardAvgField() {
    return 'ROUND(AVG(CASE WHEN "value" >= 0 THEN "value" ELSE 0 END),2)';
  }

  async getAllScoresOfProjectBranches(data: Array<{ branchName: string, projectId: string; }>) {
    const projectIds = data.map(({ projectId: id }) => id);
    const branches = data.map(({ branchName: branch }) => branch);

    /**
     * 1. Get all other variations of a project branch average score same Grouping as ranking
     * 2. Filter only needed branch, projects and values
     */
    const leaderboardOtherScores = (await sequelize.query(
      `SELECT * FROM (
          SELECT "projectId", "name",
          ${this.getLeaderboardAvgField} * 100 AS "value",
          (SELECT "branch" FROM "builds" WHERE "statistics"."buildId" = "builds"."id") AS "branch"
            FROM "statistics" AS "statistics"
            WHERE "statistics"."name" IN(:name) AND
            "statistics"."projectId" IN(:projectId)
            GROUP BY "projectId", "branch", "name"
        ) AS a
        WHERE "branch" IN(:branch)`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          name: Object.keys(DB_SCORE_KEY_TO_LH_KEY),
          projectId: projectIds,
          branch: branches,
        },
        model: Statistic,
        raw: true,
      },
    )) as Array<StatisticInstance & { branch: string }>;

    return leaderboardOtherScores.reduce<
    Record<string, LighthouseScoreType>
    >((prev, {
      branch: branchName, value, name, projectId,
    }) => {
      const buildScores = prev;
      const key = `${projectId}:${branchName}`;
      const roundedValue = Math.min(value, 100);
      if (key in buildScores) {
        buildScores[key][DB_SCORE_KEY_TO_LH_KEY[name]] = roundedValue;
      } else {
        buildScores[key] = {
          [DB_SCORE_KEY_TO_LH_KEY[name]]: roundedValue,
        } as LighthouseScoreType;
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
      group = ['projectId', 'branch'];
    } else {
      group = ['projectId', 'branch', 'name'];
    }

    /**
     * raw query is used to handle filtering after ranking as sub query is not feasible in orm
     * To avoid sql injection conditionally replacement values are placed and values are injected from replacement
     * Operations done
     * 1. Get field projectId, average * 100 and branch name as subquery from build table
     * 2. Group projectId, branch and name if not overall
     * 3. Only select specific categories of our interest PWA, Accessbility etc
     * 4. Order by Rank and createdAt as tie breaker
     * 5. Then keeping rank apply limit and offset projectId
     */
    const stats = await sequelize.query(
      `SELECT * FROM (
          SELECT "projectId", ${this.getLeaderboardAvgField} * 100 AS "score",
          (DENSE_RANK() OVER (ORDER BY  ${this.getLeaderboardAvgField} DESC)) AS "rank"
          ${isOveralCategory ? '' : ', "name"'},
          (SELECT "branch" FROM "builds" WHERE "statistics"."buildId" = "builds"."id") AS "branch"
          FROM "statistics" AS "statistics"
          WHERE "statistics"."name" ${isOveralCategory ? 'IN(:name)' : '= :name'}
          GROUP BY "${group.join('","')}"
          ORDER BY ${this.getLeaderboardAvgField} ${sort === 'DESC' ? 'DESC' : 'ASC'},
          max("createdAt") ${sort === 'DESC' ? 'DESC' : 'ASC'}
        ) AS a
        ${projects.length ? 'WHERE "projectId" IN(:projectId)' : ''}
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

    const projectBranches = stats.map(({ projectId, branch }) => ({
      branchName: branch,
      projectId,
    }));

    /**
     * 1. Get by same grouping as rank tanle
     * 2. Then count the number of rows generated
     * 3. If search is done do it with projectId filter
     */
    const count = (await sequelize.query(
      `
    SELECT COUNT(*) FROM (
      SELECT "projectId",
      (SELECT "branch" FROM "builds" WHERE "statistics"."buildId" = "builds"."id") AS "branch"
      FROM "statistics"
      ${projects.length ? 'WHERE "projectId" IN(:projectId)' : ''}
      GROUP BY "projectId", "branch"
    )
    AS a`,
      {
        type: QueryTypes.SELECT,
        raw: true,
        replacements: {
          projectId: projects.map(({ id }) => id),
        },
      },
    )) as { count: string }[];

    if (!projectBranches.length) {
      return { count: count[0].count, rows: [] };
    }

    const leaderBoardScores = await this.getAllScoresOfProjectBranches(
      projectBranches,
    );

    const uniqueProjectIds: Record<string, boolean> = {};
    const projectIds = stats.reduce((ids, stat) => {
      if (!uniqueProjectIds?.[stat.projectId]) ids.push(stat.projectId);
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

    stats.forEach((stat) => {
      stat.score = leaderBoardScores[`${stat.projectId}:${stat.branch}`];
      stat.project = projectsGroupedById[stat.projectId][0] as any;
    });

    return { count: count[0].count, rows: stats };
  }

  // same query as leaderboard but for a particule project's branch
  async getLHRankingOfAProjectBranch({
    projectId, branch, sort = 'DESC',
    type = 'overall',
  }: BuildLeaderboardRankOption) {
    let group = [];

    const isOveralCategory = type === 'overall';
    const scoreFieldsDb = Object.keys(DB_SCORE_KEY_TO_LH_KEY);

    if (isOveralCategory) {
      group = ['projectId', 'branch'];
    } else {
      group = ['projectId', 'branch', 'name'];
    }

    /**
     * Same as ranking. Only key difference is
     * Its done for a projectid and branch specifically
     */
    const stats = await sequelize.query(
      `SELECT * FROM (
          SELECT "projectId",  ${this.getLeaderboardAvgField} * 100 AS "score",
          (DENSE_RANK() OVER (ORDER BY  ${this.getLeaderboardAvgField} DESC)) AS "rank"
          ${isOveralCategory ? '' : ', "name"'},
          (SELECT "branch" FROM "builds" WHERE "statistics"."buildId" = "builds"."id") AS "branch"
          FROM "statistics" AS "statistics"
          WHERE "statistics"."name" ${isOveralCategory ? 'IN(:name)' : '= :name'}
          GROUP BY "${group.join('","')}"
          ORDER BY  ${this.getLeaderboardAvgField} ${sort === 'DESC' ? 'DESC' : 'ASC'},
          max("createdAt") ${sort === 'DESC' ? 'DESC' : 'ASC'}
        ) AS a
        where "projectId" = :projectId AND  "branch" = :branch
        LIMIT 1`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          projectId,
          branch,
          name: isOveralCategory ? scoreFieldsDb : type,
        },
        model: Statistic,
        raw: true,
      },
    ) as unknown as LeadboardStatistic[];

    if (!stats.length) {
      throw Error('No stats found');
    }

    const leaderBoardScores = await this.getAllScoresOfProjectBranches([{ branchName: branch, projectId }]);

    const stat = stats[0];

    const project = await Project.findOne({
      raw: true,
      where: {
        id: projectId,
      },
    });

    if (!project) {
      throw Error('Project not found');
    }

    stat.project = project as any;
    stat.score = leaderBoardScores[`${projectId}:${branch}`];
    return stat;
  }
}

export const lhDbManager = new LighthouseDbManager();

Object.freeze(lhDbManager);
