import { spawn } from 'child_process';
import { pubsub, lhci } from "../helpers";
import * as fs from "fs";
import { camelCase } from 'lodash';


export const LighthouseAuditResolver = {
  Query: {
    async listLHProjects(root: any, args: any, ctx: any){
      return await lhci.fetchProjects(args.serverBaseUrl || process.env.SERVER_BASE_URL);
    },
    async listProjectLHReport(root: any, args: any, ctx: any) {
      return await lhci.fetchProjectLHR(args.serverBaseUrl || process.env.SERVER_BASE_URL, args.projectID, args.buildID);
    },
    async verifyLHProjectDetails(root: any, args: any, ctx: any) {
      return await lhci.fetchProjectDetails(args.serverBaseUrl || process.env.SERVER_BASE_URL, args.buildToken);
    },
    async listLHProjectBuilds ( root: any, args: any, ctx: any ) {
      const projectBuilds = await lhci.fetchProjectBuilds( args.serverBaseUrl || process.env.SERVER_BASE_URL, args.projectID, args.branch, args.limit );
      return projectBuilds.map( async ( build: any ) => {
        const { id, projectId } = build;
        const score = await lhci.fetchProjectLHR(
          args.serverBaseUrl || process.env.SERVER_BASE_URL,
          projectId,
          id
        );
        build.score = score;
        return build;
      } );
    },
    async listLHProjectBranches(root: any, args: any, ctx: any){
      return await lhci.fetchProjectBranches(args.serverBaseUrl || process.env.SERVER_BASE_URL, args.projectID);
    },
    async listLHScore(root: any, args: any, ctx: any) {
      let directoryPromises: any = [];
      let filePromises: any = [];
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
          if(err) {
            reject(err);
          }
        });
      });
      directoryPromises.push(fileListPromise);
      const paths: any[] = await Promise.all(directoryPromises).then((values) => values[0]) as any;
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
      const reports: any[] = await Promise.all(filePromises).then((values) => values[0]) as any;
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
     auditWebsite(root: any, args: any, ctx: any) {
      const LHCI_BUILD_CONTEXT__CURRENT_HASH = new Date().getTime().toString(16).split('').reverse().join('');
      const lhciScript = spawn(` cd /tmp && mkdir ${LHCI_BUILD_CONTEXT__CURRENT_HASH} && cd ${LHCI_BUILD_CONTEXT__CURRENT_HASH} &&
      lhci healthcheck && lhci collect --settings.chromeFlags='--no-sandbox --ignore-certificate-errors' --url=${args.property.sites} && lhci assert --preset=${args.property.preset || `lighthouse:recommended`}`, {
        shell: true
      });
      lhciScript.stdout.on('data', async data => {
        console.log(data.toString());
        pubsub.publish('AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString() }).catch(err => console.error(err));
      });

      lhciScript.stderr.on('data', (data) => {
        console.error(data.toString());
        pubsub.publish('AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + data.toString() }).catch(err => console.error(err));
      });

      lhciScript.on('exit', (code) => {
        console.log(`Process exited with code ${code}`);
        pubsub.publish('AUTORUN', { autorun: LHCI_BUILD_CONTEXT__CURRENT_HASH + code }).catch(err => console.error(err));
      });
      return LHCI_BUILD_CONTEXT__CURRENT_HASH;
    },
    async uploadLHReport(root: any, args: any, ctx: any) {
      const profile = await lhci.fetchProfileFavicon ( args.property.authorEmail );
      const LHCI_BUILD_CONTEXT__COMMIT_MESSAGE = `${ args.property.commitMessage || `Benchmark Commit by ${ args.property.authorName }` }`;
      const lhciScript = spawn( ` cd /tmp && cd ${ args.property.auditId } &&
      export LHCI_BUILD_CONTEXT__CURRENT_HASH=${ args.property.auditId } &&
      export LHCI_BUILD_CONTEXT__COMMIT_TIME="${ new Date().toString() }" &&
      export LHCI_BUILD_CONTEXT__CURRENT_BRANCH="${ args.property.currentBranch || process.env.CURRENT_BRANCH }" &&
      export LHCI_BUILD_CONTEXT__COMMIT_MESSAGE="${ LHCI_BUILD_CONTEXT__COMMIT_MESSAGE }" &&
      export LHCI_BUILD_CONTEXT__AUTHOR="${ args.property.authorName } <${ args.property.authorEmail }>" &&
      export LHCI_BUILD_CONTEXT__AVATAR_URL="${ profile.avatar_url }" &&
      lhci upload  --serverBaseUrl=${ args.property.serverBaseUrl || process.env.SERVER_BASE_URL } --upload.token=${ args.property.buildToken }`, {
        shell: true
      } );
      lhciScript.stdout.on('data', async data => {
        console.log(data.toString());
        pubsub.publish('AUTORUN', { autorun: args.property.auditId + data.toString() }).catch(err => console.error(err));
      });

      lhciScript.stderr.on('data', (data) => {
        console.error(data.toString());
        pubsub.publish('AUTORUN', { autorun: args.property.auditId + data.toString() }).catch(err => console.error(err));
      });

      lhciScript.on('exit', (code) => {
        console.log(`Process exited with code ${code}`);
        pubsub.publish('AUTORUN', { autorun: args.property.auditId + code }).catch(err => console.error(err));
      });
      return args.property.auditId;
    }
  },
  Subscription: {
    autorun: {
      subscribe: () => pubsub.asyncIterator("AUTORUN")
    }
  }
};
