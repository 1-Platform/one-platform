import axios from 'axios';
import capitalize from 'lodash/capitalize';
import chunk from 'lodash/chunk';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import flattenDeep from 'lodash/flattenDeep';

import uniq from 'lodash/uniq';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { FeedbackConfig } from './feedback-config/schema';
import logger from './lib/logger';
import { FeedbackModel } from './feedbacks/schema';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  logger: false,
  debug: false,
});

export const proxyAgent = process.env.ENABLE_HYDRA_PROXY === 'true'
  ? { httpsAgent: new HttpsProxyAgent(`${process.env.AKAMAI_API}`) }
  : {};

export function processIntegrationInput(userFeedback: FeedbackType, app: any, userData: any) {
  const feedback = userFeedback;
  const descriptionTemplate = `
${
  feedback?.stackInfo?.stack ? `Stack - ${feedback?.stackInfo?.stack}<br/>` : ''
}
${
  feedback?.stackInfo?.path
    ? `URL - ${feedback?.stackInfo?.path}<br/><br/>`
    : ''
}
Reported by - ${userData[0].cn} (${userData[0].mail})`;

  feedback.description = feedback?.description?.concat(descriptionTemplate) || '';
  if (feedback?.summary?.length > 240) {
    feedback.description = feedback.summary + feedback.description;
  }
  feedback.summary = (feedback?.summary?.length > 240 || !feedback?.summary)
    ? `${capitalize(feedback.category)} reported by ${userData[0].cn} for ${
      app[0].name
    }`
    : feedback.summary;
  return feedback;
}

async function listApps(): Promise<App[]> {
  const appsResponse = await axios.request({
    url: process.env.API_GATEWAY,
    method: 'POST',
    headers: {
      Authorization: `${process.env.GATEWAY_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      query: `query Apps {
                apps {
                  appId
                  projectId
                  path
                  name
                }
              }`,
      variables: null,
    }),
  }).catch((err: Error) => {
    logger.error(err.message);
    throw new Error('Apps Query failed with Apps Service');
  }).then((response) => response.data.data.apps.filter((app: App) => app.path !== null));
  return appsResponse;
}
async function getApp(params: any) {
  const appResponse = await axios
    .request({
      url: process.env.API_GATEWAY,
      method: 'POST',
      headers: {
        Authorization: `${process.env.GATEWAY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: `
            query FindApps($id: ID) {
                findApps(selectors: { id: $id }) {
                  id
                  path
                  name
                }
              }`,
        variables: params,
      }),
    })
    .catch((err: Error) => {
      logger.error(err.message);
      throw new Error('findApps Query failed with Apps Service');
    })
    .then((response) => response.data.data.findApps);
  return appResponse;
}
async function listGitlabIssues(apiQueryParams: any) {
  const gitlabResponse = await axios
    .request({
      url: `${apiQueryParams.sourceUrl || process.env.GITLAB_API}`,
      method: 'POST',
      headers: {
        Authorization: `${process.env.GITLAB_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: `query ListGitlabIssues { ${apiQueryParams.query} }`,
        variables: null,
      }),
    })
    .then((response) => response.data)
    .then((response: any) => Object.keys(response.data).map((key) => {
      response.data[key].issue.assignee = {
        name: response.data[key]?.issue?.assignees?.nodes[0]?.name || null,
        email: response.data[key]?.issue?.assignees?.nodes[0]?.email || null,
        url: response.data[key]?.issue?.assignees?.nodes[0]?.webUrl || null,
      };
      return response.data[key]?.issue;
    }))
    .catch((err: Error) => {
      logger.error(err.message);
      throw new Error('ListGitlabIssues Query failed with Gitlab Integration');
    });
  return gitlabResponse;
}
async function listGithubIssues(apiQueryParams: any) {
  const githubResponse = await axios
    .request({
      url: `${apiQueryParams.sourceUrl || process.env.GITHUB_API}`,
      method: 'POST',
      headers: {
        Authorization: `${process.env.GITHUB_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: `query ListGithubIssues { ${apiQueryParams.query} }`,
        variables: null,
      }),
    })
    .then((response) => response.data)
    .then((response: any) => Object.keys(response.data).map((key) => {
      response.data[key].issue.assignee = {
        name: response.data[key]?.issue?.assignees?.nodes[0]?.name || null,
        email: response.data[key]?.issue?.assignees?.nodes[0]?.email || null,
        url: response.data[key]?.issue?.assignees?.nodes[0]?.webUrl || null,
      };
      return response.data[key]?.issue;
    }))
    .catch((err: Error) => {
      logger.error(err.message);
      throw new Error('ListGithubIssues Query failed with Github Integration');
    });
  return githubResponse;
}
async function listJira(jiraQuery: any) {
  const jiraList: Array<any> = [];
  const jiraResponse: any = await axios
    .request<any>({
    url: `${jiraQuery.sourceUrl || process.env.JIRA_HOST}/rest/api/2/search?jql=${jiraQuery.query}`,
    method: 'GET',
    headers: {
      Authorization: `${process.env.JIRA_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    ...proxyAgent,
  })
    .then((response) => response.data)
    .catch((error: Error) => {
      logger.error(error.message);
      throw new Error('listJira operation failed');
    });
  await jiraResponse?.issues?.forEach((jira: any) => {
    jiraList.push({
      key: jira.key,
      url: `${new URL(jira.self).origin}/browse/${jira.key}`,
      lastUpdated: jira.fields.updated,
      summary: jira.fields.summary,
      description: jira.fields.description,
      state: jira.fields?.status?.name,
      assignee: {
        name: jira.fields?.assignee?.displayName || null,
        email: jira.fields?.assignee?.emailAddress || null,
        uid: jira.fields?.assignee?.name || null,
      },
    });
  });
  return jiraList;
}
function sendEmail(data: any) {
  transporter.sendMail(
    {
      from: data.from,
      to: data.to,
      cc: data.cc,
      subject: data.subject,
      html: data.body,
    },
    (err: Error) => {
      if (err) {
        logger.error(err.message);
        throw err;
      }
      return { message: 'Email Sent' };
    },
  );
}
function buildUserQuery(rhatUuids: string[]) {
  const uniqueRhatUuids: string[] = uniq(compact(rhatUuids));
  let query: string = '';
  uniqueRhatUuids.forEach((rhatUuid: string) => {
    query += `rhatUUID_${(rhatUuid as string).replace(
      /-/g,
      '',
    )}:getUsersBy(rhatUUID:"${rhatUuid}") {
      cn
      mail
      uid
      rhatUUID
    }`;
  });

  return `query ListUsers {
    ${query}
  }`;
}
async function getUserProfiles(userQuery: any) {
  const userResponse = await axios
    .request({
      url: process.env.API_GATEWAY,
      method: 'POST',
      headers: {
        Authorization: `${process.env.GATEWAY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: userQuery,
        variables: null,
      }),
    })
    .catch((err: Error) => {
      logger.error(err.message);
      throw new Error('getUsersBy operation failed with User group Microservice');
    })
    .then((response) => response.data)
    .then((response) => Object.keys(response.data).map((key) => response.data[key][0]));
  return userResponse;
}
function formatSearchInput(data: any, userData: any) {
  return {
    input: {
      dataSource: process.env.SEARCH_DATA_SOURCE,
      documents: {
        id: data._id,
        title: data.summary,
        abstract: data.description,
        description: data.description,
        icon: 'assets/icons/feedback.svg',
        uri: `${process.env.FEEDBACK_CLIENT}?id=${data._id}`,
        tags: 'Feedback',
        contentType: 'Feedback',
        createdBy: userData[0].cn || '',
        createdDate: data?.createdOn || new Date(),
        lastModifiedBy: data?.updatedBy || '',
        lastModifiedDate: data?.updatedOn || new Date(),
      },
    },
  };
}
async function manageSearchIndex(data: any, mode: string) {
  const searchResponse = await axios
    .request({
      url: process.env.API_GATEWAY,
      method: 'POST',
      headers: {
        Authorization: `${process.env.GATEWAY_AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        query: `
        mutation ManageIndex($input: SearchInput, $mode: String!) {
          manageIndex(input: $input, mode: $mode) {
            status
          }
        }`,
        variables: {
          input: mode === 'index' ? data?.input : data,
          mode,
        },
      }),
    })
    .then((response) => response.data)
    .then((response: any) => {
      const succesStatusCodes = [200, 204];
      if (succesStatusCodes.includes(response.data?.manageIndex?.status)) {
        logger.info('Sucessfully completed the index updation.');
      } else if (
        !succesStatusCodes.includes(response.data?.manageIndex?.status)
      ) {
        logger.info('Error in index updation.');
      }
    })
    .catch((err: Error) => {
      logger.error(err.message);
    });
  return searchResponse;
}
function createEmailTemplate(
  userInfo: any,
  feedback: FeedbackType,
  projectId: string,
  config: FeedbackConfigType,
) {
  const appName = projectId.split( '/' )[ 1 ] ?? projectId;

  const getPageUrl = ( str: string ) => {
    try {
      const url = new URL( str );
      return url.toString();
    } catch ( err ) {
      return new URL( str, config.projectFrontendUrl ?? process.env.FEEDBACK_CLIENT!.toLowerCase() );
    }
  }

  const pageUrl = getPageUrl(feedback.stackInfo?.path ?? '/');

  const emailBody = `
Hi ${userInfo[0].cn},<br/><br/>
We have received the ${feedback.category.toLowerCase()} for the ${appName}<br/><br/>

Summary: ${feedback.summary}<br/><br/>
URL: ${pageUrl}<br/><br/>

${
  feedback.ticketUrl
    ? `A ticket has opened for the reported ${feedback.category.toLowerCase()} and you can track the progress at ${
        feedback.ticketUrl
      }<br/><br/>`
    : ''
}
Thanks<br/><br/>

P.S.: This is an automated email. Please do not reply.
`;

  const emailData = {
    from: 'no-reply@redhat.com',
    cc: config.feedbackEmail,
    to: userInfo[0].mail,
    subject: `${feedback.error ? feedback.error : feedback.experience} - ${
      feedback.category.charAt(0) + feedback.category.substring(1).toLowerCase()
    } reported for ${appName}.`,
    body: emailBody,
  };
  return emailData;
}
async function processFeedbackRecords(userFeedbacks: any) {
  if (userFeedbacks.length) {
    const feedbacks = groupBy(userFeedbacks, 'config');
    let query = '';
    const queryList: any[] = [];
    const configs = await FeedbackConfig.find().exec();
    const intResponses: any[] = [];
    const userList: any[] = [];
    let intResponse: any = [];
    const jiraResponses: any = [];
    let jiraQueryPromises: any = null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const integrationPromise = new Promise((resolve, reject) => {
      Object.keys(feedbacks).forEach(async (key: string, index: number) => {
        await feedbacks[key].forEach(
          async (record: FeedbackType, keyIndex: number) => {
            userList.push(record.createdBy, record.updatedBy);
            const config = configs.find(
              (conf) => key.toString() === conf._id.toString(),
            );
            if (!config) return;
            if (!record.ticketUrl) return;
            const issueIdParam = record.ticketUrl.split('/').length;
            if (config.sourceType === 'JIRA') {
              query += `issue=${
                record.ticketUrl.split('/')[issueIdParam - 1]
              } `;
            } else if (config.sourceType === 'GITLAB') {
              query += `gitlab_${keyIndex}_${
                record.ticketUrl.split('/')[issueIdParam - 1]
              }:project(fullPath: "${config.projectKey}") {issue(iid: "${
                record.ticketUrl.split('/')[issueIdParam - 1]
              }") {
          title
          description
          state
          webUrl
          assignees {
            nodes {
            name
            email
            webUrl
          }
        }
      }
    }`;
            } else if (config.sourceType === 'GITHUB') {
              query += `github_${keyIndex}_${
                record.ticketUrl.split('/')[issueIdParam - 1]
              }:repository(name: "${
                record.ticketUrl.split('/')[issueIdParam - 3]
              }", owner: "${record.ticketUrl.split('/')[issueIdParam - 4]}") {
        issue(number: ${Number(
    record.ticketUrl.split('/')[record.ticketUrl.split('/').length - 1],
  )}) {
          url
          title
          body
          state
          author {
            login
          }
          assignees(first:100) {
            nodes {
            name
            email
          }
        }
      }
    }`;
            }
            if (feedbacks[key].length === keyIndex + 1) {
              const apiQueryParams = {
                query,
                sourceUrl: config.sourceApiUrl,
                source: config.sourceType,
              };
              queryList.push(apiQueryParams);
              query = '';
            }
          },
        );
        if (Object.keys(feedbacks).length === index + 1) {
          resolve(queryList);
        }
      });
    });
    return integrationPromise.then(async (promises: any) => {
      await promises.forEach(async (promise: any) => {
        if (promise.source === 'GITLAB') {
          intResponse = await listGitlabIssues(promise);
          intResponses.push(intResponse);
        } else if (promise.source === 'GITHUB') {
          intResponse = await listGithubIssues(promise);
          intResponses.push(intResponse);
        } else if (promise.source === 'JIRA') {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          jiraQueryPromises = new Promise((resolve, reject) => {
            const jiraQueryChunk = chunk(
              compact(promise.query.split(' ')),
              50,
            );
            jiraQueryChunk.forEach(async (jira: any, jiraIndex: number) => {
              const jiraParam: object = {
                ...promise,
                query: jira.join(' OR '),
              };
              const jiraResponse = await listJira(jiraParam);
              jiraResponses.push(jiraResponse);
              if (jiraQueryChunk.length === jiraIndex + 1) {
                resolve(jiraResponses);
              }
            });
          });
        }
      });
    })
      .then(async () => {
        const mergedJira = jiraQueryPromises !== null
          ? await jiraQueryPromises.then(async (data: any) => data[0])
          : [];

        return flattenDeep(mergedJira.concat(intResponses));
      })
      .then(async (integrationResponses) => {
        let userData: any[] = [];
        const ldapUsers = userList.filter(user => user && !user.startsWith('user:'));
        if (ldapUsers.length > 0) {
          const userQuery = buildUserQuery(ldapUsers);
          userData = [userData, ...await getUserProfiles(userQuery)];
        }
        /* For other users */
        userList.filter(user => user?.startsWith('user:')).forEach(user => {
          const [ _, cn ] = user.split('/');
          userData.push({
            cn,
            mail: `${cn}@redhat.com`,
            uid: cn,
            rhatUUID: user,
          });
        });
        const userDataObj = userData.reduce((prev, curr) => {
          const userObj = { ...prev, [curr.rhatUUID]: curr };
          return userObj;
        }, {});

        return userFeedbacks.map(async (feedback: FeedbackModel) => {
          const userFeedback = feedback.toObject({ virtuals: true });
          const selectedResponse: any = await integrationResponses.filter(
            (response: any) => userFeedback?.ticketUrl === (response?.webUrl || response?.url),
          )[0];
          const config = configs.find(
            (conf) => feedback.config === conf._id.toString(),
          );
          userFeedback.source = config?.sourceType || '';
          userFeedback.module = config?.projectId?.split('/')?.[1] ?? '';
          userFeedback.state = selectedResponse?.state || feedback?.state;
          userFeedback.assignee = selectedResponse?.assignee || {};
          userFeedback.createdBy = userDataObj?.[feedback.createdBy as string] || null;
          userFeedback.updatedBy = userDataObj?.[feedback.updatedBy as string] || null;
          return userFeedback;
        });
      });
  }
  return [];
}

export default {
  buildUserQuery,
  createEmailTemplate,
  formatSearchInput,
  getApp,
  getUserProfiles,
  listApps,
  manageSearchIndex,
  processFeedbackRecords,
  sendEmail,
  transporter,
};
