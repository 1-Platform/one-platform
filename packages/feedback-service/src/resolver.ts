/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 *
 * @version 0.0.3
 *
 * GraphQL interface for managing the business logic
 *
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-06-28 17:21:06
 */
import { Feedback } from './schema';
import { FeedbackIntegrationHelper } from './helpers';
import * as _ from 'lodash';

export const FeedbackResolver = {
  Query: {
    async listFeedbacks(root: any, args: any, ctx: any) {
      let Apps = await FeedbackIntegrationHelper.listApps();
      const queryList: Array<object> = [];
      const promises: any = [];
      let feedbackList: Array<FeedbackType> = [];
      let query: string = ``;
      let timestampQuery: string = ``;
      let userData: Array<object> = [];
      return Feedback.find().sort({ 'createdOn': -1 }).lean()
        .then((response: FeedbackType[]) => {
          return response.map((res: any) => {
            const filteredApps = Apps.filter((app: any) => app?.id === res?.config)[0] || null;
            res.feedback = filteredApps.feedback || null;
            res.module = filteredApps.name || null;
            res.source = res.feedback.sourceType || null;
            return res;
          });
        }).then((feedback: any) => {
          feedbackList = feedback;
          if (feedbackList.length) {
            feedback = _.groupBy(feedback, 'feedback.sourceApiUrl');
            Object.keys(feedback).map((key: string) => {
              feedback[key].forEach((groupedList: FeedbackType, index: any) => {
                timestampQuery += `
                rhatUUID_${(groupedList.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${groupedList.createdBy}") {
                  cn
                  mail
                  uid
                  rhatUUID
                }

                ${(groupedList.updatedBy) ? `
                rhatUUID_${(groupedList.updatedBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${groupedList.updatedBy}") {
                  cn
                  mail
                  uid
                  rhatUUID
                }
                `: ``}
                `;
                if ((groupedList as any).feedback.sourceType === 'GITLAB') {
                  query += `
                        gitlab_${index}_${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}:project(fullPath: "${(groupedList as any).feedback.projectKey}") {
                          issue(iid: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}") {
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
                      }
                      `;
                  if (feedback[key].length === index + 1) {
                    query = `query listGitlabIssues {${query} }`;
                    const gitlabQuery = {
                      'query': query,
                      'sourceUrl': key,
                      'source': (groupedList as any).feedback.sourceType
                    }
                    query = '';
                    queryList.push(gitlabQuery);
                  }
                } else if ((groupedList as any).feedback.sourceType === 'GITHUB') {
                  query += `
                    gitlab_${index}_${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}:repository(name: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 3]}", owner: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 4]}") {
                          issue(number: ${Number(groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1])}) {
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
                              url
                              }
                          }
                          }
                      }`;
                  if (feedback[key].length === index + 1) {
                    query = `query listGithubIssues {${query} }`;
                    const githubQuery = {
                      'query': query,
                      'sourceUrl': key,
                      'source': (groupedList as any).feedback.sourceType
                    }
                    query = '';
                    queryList.push(githubQuery);
                  }
                } else if ((groupedList as any).feedback.sourceType === 'JIRA') {
                  query += `${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]} `;
                  if (feedback[key].length === index + 1) {
                    const jiraQuery = {
                      'query': query,
                      'sourceUrl': key,
                      'source': (groupedList as any).feedback.sourceType
                    }
                    query = '';
                    queryList.push(jiraQuery);
                  }
                }
              });
            });
          }
        }).then(async () => {
          if (feedbackList.length) {
            timestampQuery = `query ListUsers {
              ${timestampQuery}
            }`;
            userData = await FeedbackIntegrationHelper.getUserProfiles(timestampQuery);
            queryList.map(async (queries: any) => {
              if (queries.source === 'GITLAB') {
                const gitlabPromise = new Promise(async (resolve, reject) => {
                  const gitlabResponse: Array<object> = await FeedbackIntegrationHelper.listGitlabIssues(queries);
                  resolve(gitlabResponse);
                }).catch((err: Error) => {
                  throw err
                });
                promises.push(gitlabPromise)
              } else if (queries.source === 'GITHUB') {
                const githubPromise = new Promise(async (resolve, reject) => {
                  const githubResponse: Array<object> = await FeedbackIntegrationHelper.listGithubIssues(queries);
                  resolve(githubResponse);
                }).catch((err: Error) => {
                  throw err
                });
                promises.push(githubPromise)
              } else if (queries.source === 'JIRA') {
                queries.query.trim().split(' ').map((issue: any) => {
                  const jiraPromise = new Promise(async (resolve, reject) => {
                    const query = {
                      query: issue,
                      source: queries.source,
                      sourceUrl: queries.sourceUrl
                    };
                    const jiraResponse: any = await FeedbackIntegrationHelper.listJira(query);
                    resolve(jiraResponse);
                  }).catch((err: Error) => {
                    throw err
                  });
                  promises.push(jiraPromise);
                });
              }
            });
          }
        }).then(async () => {
          const responses = await Promise.all(promises).then((values) => _.flattenDeep(values));
          return feedbackList.map((feedback: FeedbackType) => {
            const selectedResponse = (responses.filter((response: any) => feedback?.ticketUrl === (response?.webUrl || response?.url))[0] as any);
            feedback.state = selectedResponse?.state;
            feedback.assignee = selectedResponse?.assignee;
            (feedback as any).createdBy = userData.filter((user: any) => user.rhatUUID === feedback.createdBy)[0];
            (feedback as any).updatedBy = userData.filter((user: any) => user.rhatUUID === feedback.updatedBy)[0];
            return feedback;
          });
        }).catch((error: Error) => error);
    },
    listFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args._id).exec()
        .then((response: FeedbackType) => response)
        .catch((error: Error) => error);
    },
  },
  Mutation: {
    async createFeedback(root: any, args: any, ctx: any) {
      let apps: any;
      let apiResponse: any = {};
      let userQuery = `query GetUsersBy {
        rhatUUID_${(args.input.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${args.input.createdBy}") {
          name
          uid
          rhatUUID
        }
      }`;
      let userData = await FeedbackIntegrationHelper.getUserProfiles(userQuery);
      if (!args.input.config && args.input?.stackInfo?.path) {
        apps = await FeedbackIntegrationHelper.listApps();
        apps = apps.filter((response: any) => response.path === `/${args.input.stackInfo.path.split('/')[1]}`)[0];
        args.input.config = apps.id;
      } else if ((args.input.config && !args.input?.stackInfo?.path) || (args.input.config && args.input?.stackInfo?.path)) {
        let appParam = {
          id: args.input.config
        };
        apps = await FeedbackIntegrationHelper.getApp(appParam);
      }
      let descriptionTemplate = `
${(args.input?.error) ? `<br/>Error: ${args.input?.error}` : ``}
${(args.input?.experience) ? `<br/>Experience: ${args.input?.experience}` : ``}
${(args.input?.description) ? `<br/>Description: ${args.input?.description}` : ``}
${(args.input?.stackInfo?.stack || args.input?.stackInfo?.path) ? `<br/><br/>
Browser Information<br/>
___________________<br/>
`: ``}
${(args.input?.stackInfo?.stack) ? `Stack - ${args.input?.stackInfo?.stack}<br/>` : ``}
${(args.input?.stackInfo?.path) ? `URL - ${args.input?.stackInfo?.path}<br/><br/>` : ``}
Reported by <br/>
Name - ${(apps.feedback.sourceType === 'JIRA') ? `[~${userData[0].uid}]` :
          (apps.feedback.sourceType !== 'JIRA') ? `${userData[0].cn} (${userData[0].uid})` : ''}
`;
      if (!args.input.description) {
        args.input.description = descriptionTemplate;
      } else if (args.input.description) {
        args.input.description = args.input.description.concat(descriptionTemplate);
      }
      let summary = (!args?.input?.summary || args.input.summary.length > 230) ?
        `${args.input.category} reported by ${userData[0].cn} for ${apps.name}`
        : args.input.summary;
      let description = (args.input?.summary?.length > 230) ? args.input.summary + args.input.description : args.input.description;

      switch (apps.feedback.sourceType) {
        case 'GITHUB':
          const query = {
            'githubIssueInput': {
              'title': summary,
              'body': description,
              'repositoryId': apps.feedback.projectKey
            },
            'sourceUrl': apps.feedback.sourceApiUrl
          };
          const githubResponse = await FeedbackIntegrationHelper.createGithubIssue(query);
          apiResponse = {
            ...args.input,
            ticketUrl: githubResponse.issue.url
          };
          break;
        case 'JIRA':
          const jiraQuery = {
            'jiraIssueInput': {
              'fields': {
                'project': {
                  'key': apps.feedback.projectKey
                },
                'summary': summary,
                'description': description.replace(/(<([^>]+)>)/ig, ''),
                'labels': ['Reported-via-One-Platform'],
                'issuetype': {
                  'name': 'Task'
                },
              }
            },
            'sourceUrl': apps.feedback.sourceApiUrl
          };
          const jiraResponse = await FeedbackIntegrationHelper.createJira(jiraQuery);
          apiResponse = {
            ...args.input,
            ticketUrl: `https://${apps.feedback.sourceApiUrl || process.env.JIRA_HOST}/browse/${jiraResponse.key}`,
          };
          break;
        case 'GITLAB':
          const gitlabQuery: object = {
            'gitlabIssueInput': {
              'title': summary,
              'description': description,
              'projectPath': apps.feedback.projectKey
            },
            'sourceUrl': apps.feedback.sourceApiUrl
          };
          const gitlabResponse = await FeedbackIntegrationHelper.createGitlabIssue(gitlabQuery);
          apiResponse = {
            ...args.input,
            ticketUrl: gitlabResponse.webUrl
          };
          break;
        default:
          console.warn('Integration not Mentioned/Available');
          apiResponse = {
            ...args.input
          };
      }
      const emailBody = `
Hi ${userData[0].cn},<br/><br/>
Please find the details of the feedback we recieved as below:<br/><br/>
Summary: ${apiResponse.summary}<br/><br/>
Description: ${apiResponse.description}<br/><br/>
You can track updates for your feedback at: ${apiResponse.ticketUrl}<br/><br/>

Thanks<br/><br/>

P.S.: This is an automated email. Please do not reply.
`;
      const emailData = {
        from: `no-reply@redhat.com`,
        cc: userData[0].mail,
        to: apps.feedback.feedbackEmail,
        subject: `Thanks for submitting the ${apiResponse.category} ${(apps.name) ? `for ${apps.name}` : ''}.`,
        body: emailBody
      };
      FeedbackIntegrationHelper.sendEmail(emailData);
      apiResponse.description = apiResponse.description.replace(/(<([^>]+)>)/ig, '');
      return new Feedback(apiResponse).save()
        .then(async (response: any) => {
          response.createdBy = userData[0].cn;
          const formattedSearchResponse = FeedbackIntegrationHelper.formatSearchInput(response);
          FeedbackIntegrationHelper.manageSearchIndex(formattedSearchResponse, 'index');
          return response;
        })
        .catch((error: Error) => error);
    },
    updateFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args.input._id)
        .then((response: FeedbackType) => {
          return Object.assign(response, args.input).save()
            .then(async (feedback: FeedbackType) => {
              let userQuery = `query ListUsers {
                rhatUUID_${(feedback.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${feedback.createdBy}") {
                  cn
                  uid
                  rhatUUID
                }
                ${(feedback.updatedBy) ? `
                rhatUUID_${(feedback.updatedBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${feedback.updatedBy}") {
                  cn
                  uid
                  rhatUUID
                }
              }
              `: ``}
              `;
              let userData = await FeedbackIntegrationHelper.getUserProfiles(userQuery);
              response.createdBy = userData.filter((user: any) => user.rhatUUID === feedback.createdBy)[0].cn;
              response.updatedBy = userData.filter((user: any) => user.rhatUUID === feedback.updatedBy)[0].cn;
              const formattedSearchResponse = FeedbackIntegrationHelper.formatSearchInput(response);
              FeedbackIntegrationHelper.manageSearchIndex(formattedSearchResponse, 'index');
              return feedback;
            });
        }).catch((err: Error) => err);
    },
    deleteFeedback(root: any, args: any, ctx: any) {
      return Feedback.findByIdAndRemove(args._id)
        .then((response: FeedbackType) => {
          let input = {
            dataSource: "oneportal",
            documents: [ { 'id': args._id } ]
          };
          FeedbackIntegrationHelper.manageSearchIndex(input, 'delete');
          return response;
        })
        .catch((error: Error) => error);
    },
    updateFeedbackIndex(root: any, args: any, ctx: any) {
      let userQueryParams = ``;
      let searchInput: any = [];
      return Feedback.find()
        .then(async (response: any) => {
          if (response.length) {
            response.map((data: any) => {
              userQueryParams += `rhatUUID_${(data.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${data.createdBy}") {
                name
                title
                uid
                rhatUUID
              }
              ${(data.updatedBy) ? `
              rhatUUID_${(data.updatedBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${data.updatedBy}") {
                name
                title
                uid
                rhatUUID
              }`: ``}`;
              const formattedData = FeedbackIntegrationHelper.formatSearchInput(data);
              searchInput.push(formattedData);
            });
            let userQuery = `
          query ListUsers {
            ${userQueryParams}
          }`;
          let userData = await FeedbackIntegrationHelper.getUserProfiles(userQuery);
          const indexStatus = searchInput.map((searchData: any) => {
            searchData.input.documents.createdBy = userData.filter((user: any) => user.rhatUUID === searchData.input.documents.createdBy)[0]?.name;
            searchData.input.documents.updatedBy = userData.filter((user: any) => user.rhatUUID === searchData.input.documents?.updatedBy)[0]?.name;
              return FeedbackIntegrationHelper.manageSearchIndex(searchData, 'index');
            });

            if (indexStatus.length) {
              const indexResponse = {
                status: 200
              };
              return indexResponse;
            }
          }

        })
        .catch((err: Error) => err);
    }
  }
};
