import { camelCase } from 'lodash';
import { pubsub, lhci } from '../helpers';
import Logger from '../lib/logger';
import { lhDbManager } from '../lighthouse-db-manager';

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

export const LighthouseAuditResolver = {
  LHLeaderBoardCategory: {
    PWA: 'category_pwa_median',
    SEO: 'category_seo_median',
    BEST_PRACTICES: 'category_performance_median',
    ACCESSIBILITY: 'category_accessibility_median',
    PERFORMANCE: 'category_best-practices_median',
  },
  Query: {
    async listLHProjects(root: any, args: any) {
      return lhDbManager.getAllProjects(args);
    },
    async listProjectLHReport(root: any, args: any) {
      const buildScores = await lhDbManager.getLHScores(args.projectID, [
        args.buildID,
      ]);
      return buildScores[args.buildID];
    },
    async verifyLHProjectDetails(root: any, args: any) {
      return lhci.fetchProjectDetails(
        args.serverBaseUrl || process.env.SERVER_BASE_URL,
        args.buildToken,
      );
    },
    async listLHProjectBuilds(root: any, args: any) {
      const projectBuilds = await lhDbManager.getAllBuilds(
        args.projectId,
        args.branch,
        args.limit,
      );
      const lhScore = await lhDbManager.getLHScores(
        args.projectId,
        projectBuilds.map(({ id }: any) => id),
      );

      // eslint-disable-next-line no-param-reassign
      projectBuilds.forEach((build: any) => {
        build.score = lhScore[build.id];
      });
      return projectBuilds;
    },
    async listLHProjectBranches(root: any, args: any) {
      return lhDbManager.getAllBranches(args.projectId, args);
    },
    async listLHLeaderboard(root: any, args: any) {
      return lhDbManager.getLeaderBoard(args);
    }
  },
  Mutation: {
    async createLHProject(root: any, args: any) {
      const project = {
        name: args.project.name,
        baseBranch: args.project.baseBranch,
        externalUrl: args.project.externalUrl,
      };
      return lhci.createLHProject(project);
    },
    auditWebsite(root: any, args: any, ctx: any) {
      const lhciBuildContextHash = new Date()
        .getTime()
        .toString(16)
        .split('')
        .reverse()
        .join('');
      pubsub.publish('AUTORUN', { autorun: `${lhciBuildContextHash}Started the Audit` })
        .catch((err) => Logger.error(err));
      (async () => {
        const chrome = await chromeLauncher.launch({
          chromeFlags: [
            '--headless',
            ' --no-sandbox',
            '--ignore-certificate-errors',
          ],
          preset: `${args.property.preset || 'perf'}`,
        });
        const result = await lighthouse(args.property.sites, {
          logLevel: 'info',
          verbose: true,
          output: 'json',
          onlyCategories: [
            'performance',
            'accessibility',
            'best-practices',
            'seo',
            'pwa',
          ],
          port: chrome.port,
        });
        const data: any = {};
        Object.keys(result.lhr.categories).forEach((category: any) => {
          data[camelCase(category)] = Math.trunc(
            result.lhr.categories[category].score * 100,
          );
        });
        pubsub.publish('AUTORUN', { autorun: `${lhciBuildContextHash}Results:${JSON.stringify(data)}` })
          .catch((error: Error) => Logger.error(error));
        pubsub.publish('AUTORUN', { autorun: `${lhciBuildContextHash}Audit Completed` })
          .catch((err: Error) => Logger.error(err));
        await chrome.kill();
      })();
      return lhciBuildContextHash;
    },
  },
  Subscription: {
    autorun: {
      subscribe: () => pubsub.asyncIterator('AUTORUN'),
    },
  },
};
