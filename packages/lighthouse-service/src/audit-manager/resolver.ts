import { spawn } from 'child_process';
import * as fs from 'fs';
import { camelCase } from 'lodash';
import { pubsub, lhci } from '../helpers';
import Logger from '../lib/logger';
import { lhDbManager } from '../lighthouse-db-manager';

export const LighthouseAuditResolver = {
  LHLeaderBoardCategory: {
    PWA: 'category_pwa_median',
    SEO: 'category_seo_median',
    BEST_PRACTICES: 'category_performance_median',
    ACCESSIBILITY: 'category_accessibility_median',
    PERFORMANCE: 'category_best-practices_median',
  },
  Query: {
    async listLHProjects(root: any, args: any, ctx: any) {
      return lhDbManager.getAllProjects(args);
    },
    async listProjectLHReport(root: any, args: any, ctx: any) {
      const buildScores = await lhDbManager.getLHScores(args.projectID, [
        args.buildID,
      ]);
      return buildScores[args.buildID];
    },
    async verifyLHProjectDetails(root: any, args: any, ctx: any) {
      return lhci.fetchProjectDetails(
        args.serverBaseUrl || process.env.SERVER_BASE_URL,
        args.buildToken,
      );
    },
    async listLHProjectBuilds(root: any, args: any, ctx: any) {
      const projectBuilds = await lhDbManager.getAllBuilds(
        args.projectId,
        args.branch,
        args.limit,
      );
      const lhScore = await lhDbManager.getLHScores(
        args.projectId,
        projectBuilds.map(({ id }: any) => id),
      );

      projectBuilds.forEach((build: any) => (build.score = lhScore[build.id]));
      return projectBuilds;
    },
    async listLHProjectBranches(root: any, args: any, ctx: any) {
      return lhDbManager.getAllBranches(args.projectId, args);
    },
    async listLHLeaderboard(root: any, args: any, ctx: any) {
      return lhDbManager.getLeaderBoard(args);
    },
    async listLHScore(root: any, args: any, ctx: any) {
      const directoryPromises: any = [];
      const filePromises: any = [];
      const filePaths: any = [];
      const lhrReports: any = [];
      const scores: LighthouseScoreType[] = [];
      const fileListPromise = new Promise(async (resolve, reject) => {
        fs.readdir(`/tmp/${args.auditId}/.lighthouseci`, (err, files) => {
          files.map((file, index) => {
            if (file.startsWith('lhr-') && file.endsWith('.json')) {
              filePaths.push(`/tmp/${args.auditId}/.lighthouseci/${file}`);
            }
            if (files.length - 1 === index) {
              resolve(filePaths);
            }
          });
          if (err) {
            reject(err);
          }
        });
      });
      directoryPromises.push(fileListPromise);
      const paths: any[] = (await Promise.all(directoryPromises).then(
        (values) => values[0],
      )) as any;
      const fileDataPromise = await new Promise(async (resolve, reject) => {
        paths.forEach((path, index) => {
          fs.readFile(path, 'utf8', (err, data) => {
            lhrReports.push(data);
            if (index === paths.length - 1) {
              resolve(lhrReports);
            }
            if (err) {
              reject(err);
            }
          });
        });
      });
      filePromises.push(fileDataPromise);
      const reports: any[] = (await Promise.all(filePromises).then(
        (values) => values[0],
      )) as any;
      reports.map((value: any) => {
        const lhr = JSON.parse(value);
        const data: any = {};
        Object.keys(lhr.categories).map((category: any) => {
          data[camelCase(category)] = lhr.categories[category].score;
        });
        scores.push(data);
      });
      return scores;
    },
  },
  Mutation: {
    auditWebsite(root: any, args: any, ctx: any): string {
      const LHCI_BUILD_CONTEXT__CURRENT_HASH = new Date()
        .getTime()
        .toString(16)
        .split('')
        .reverse()
        .join('');
      const lhciScript = spawn(
        ` cd /tmp && mkdir ${LHCI_BUILD_CONTEXT__CURRENT_HASH} && cd ${LHCI_BUILD_CONTEXT__CURRENT_HASH} &&
      lhci healthcheck && lhci collect --settings.chromeFlags='--no-sandbox --ignore-certificate-errors' --url=${
  args.property.sites
} && lhci assert --preset=${
  args.property.preset || 'lighthouse:recommended'
}`,
        {
          shell: true,
        },
      );
      lhciScript.stdout.on('data', async (data) => {
        Logger.log(data.toString());
        pubsub
          .publish('AUTORUN', {
            autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString(),
          })
          .catch((err) => Logger.error(err));
      });

      lhciScript.stderr.on('data', (data) => {
        Logger.error(data.toString());
        pubsub
          .publish('AUTORUN', {
            autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString(),
          })
          .catch((err) => Logger.error(err));
      });

      lhciScript.on('exit', (code) => {
        Logger.info(`Process exited with code ${code}`);
        pubsub
          .publish('AUTORUN', {
            autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + code,
          })
          .catch((err) => Logger.error(err));
      });
      return LHCI_BUILD_CONTEXT__CURRENT_HASH;
    },
    async uploadLHReport(root: any, args: any, ctx: any) {
      const profile = await lhci.fetchProfileFavicon(args.property.authorEmail);
      const LHCI_BUILD_CONTEXT__COMMIT_MESSAGE = `${
        args.property.commitMessage
        || `Benchmark Commit by ${args.property.authorName}`
      }`;
      const lhciScript = spawn(
        ` cd /tmp && cd ${args.property.auditId} &&
      export LHCI_BUILD_CONTEXT__CURRENT_HASH=${args.property.auditId} &&
      export LHCI_BUILD_CONTEXT__COMMIT_TIME="${new Date().toString()}" &&
      export LHCI_BUILD_CONTEXT__CURRENT_BRANCH="${
  args.property.currentBranch || process.env.CURRENT_BRANCH
}" &&
      export LHCI_BUILD_CONTEXT__COMMIT_MESSAGE="${LHCI_BUILD_CONTEXT__COMMIT_MESSAGE}" &&
      export LHCI_BUILD_CONTEXT__AUTHOR="${args.property.authorName} <${
  args.property.authorEmail
}>" &&
      export LHCI_BUILD_CONTEXT__AVATAR_URL="${profile.avatar_url}" &&
      lhci upload  --serverBaseUrl=${
  args.property.serverBaseUrl || process.env.SERVER_BASE_URL
} --upload.token=${args.property.buildToken}`,
        {
          shell: true,
        },
      );
      lhciScript.stdout.on('data', async (data) => {
        Logger.info(data.toString());
        pubsub
          .publish('AUTORUN', {
            autorun: args.property.auditId + data.toString(),
          })
          .catch((err) => Logger.error(err));
      });

      lhciScript.stderr.on('data', (data) => {
        Logger.error(data.toString());
        pubsub
          .publish('AUTORUN', {
            autorun: args.property.auditId + data.toString(),
          })
          .catch((err) => Logger.error(err));
      });

      lhciScript.on('exit', (code) => {
        Logger.info(`Process exited with code ${code}`);
        pubsub
          .publish('AUTORUN', { autorun: args.property.auditId + code })
          .catch((err) => Logger.error(err));
      });
      return args.property.auditId;
    },
  },
  Subscription: {
    autorun: {
      subscribe: () => pubsub.asyncIterator('AUTORUN'),
    },
  },
};
