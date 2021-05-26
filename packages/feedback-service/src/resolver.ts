/**
 * MIT License
 * Copyright (c) 2021 Red Hat One Platform
 * 
 * @version 0.0.2
 * 
 * GraphQL interface for managing the business logic
 * 
 * @author Rigin Oommen <riginoommen@gmail.com>
 *
 * Created at     : 2021-01-14 13:50:01
 * Last modified  : 2021-03-04 21:40:13
 */
import { Feedback } from './schema';
import { FeedbackIntegrationHelper } from './helpers';
import * as _ from 'lodash';

export const FeedbackResolver = {
  Query: {
    async listFeedbacks(root: any, args: any, ctx: any) {
      let homeResponse = await FeedbackIntegrationHelper.listHomeType();
      const queryList: Array<object> = [];
      const promises: any = [];
      let feedbackList: Array<FeedbackType> = [];
      let query: string = ``;
      let timestampQuery: string = ``;
      let userData: Array<object> = [];
      return Feedback.find().sort({ 'createdOn': -1 }).exec()
        .then((response: FeedbackType[]) => {
          return JSON.parse(JSON.stringify(response)).map((res: any) => {
            const filteredHomeResponse = homeResponse.filter((homeRes: any) => homeRes?._id === res?.config)[0] || null;
            res.feedback = filteredHomeResponse.feedback || null;
            res.module = filteredHomeResponse.name || null;
            res.source = res.feedback.source || null;
            return res;
          });
        }).then((feedback: any) => {
          feedbackList = feedback;
          if (feedbackList.length) {
            feedback = _.groupBy(feedback, 'feedback.sourceUrl');
            Object.keys(feedback).map((key: string) => {
              feedback[key].forEach((groupedList: FeedbackType, index: any) => {
                timestampQuery += `
                rhatUUID_${(groupedList.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${groupedList.createdBy}") {
                  name
                  title
                  uid
                  rhatUUID
                }
                
                ${(groupedList.updatedBy) ? `
                rhatUUID_${(groupedList.updatedBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${groupedList.updatedBy}") {
                  name
                  title
                  uid
                  rhatUUID
                }
                `: ``}
                `;
                if ((groupedList as any).feedback.source === 'GITLAB') {
                  query += `
                        gitlab_${index}_${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}:project(fullPath: "${(groupedList as any).feedback.projectKey}") {
                          issue(iid: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}") {
                          title
                          description
                          state
                          webUrl
                          labels {
                              edges {
                              node {
                                  title
                              }
                              }
                          }
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
                      'source': (groupedList as any).feedback.source
                    }
                    query = '';
                    queryList.push(gitlabQuery);
                  }
                } else if ((groupedList as any).feedback.source === 'GITHUB') {
                  query += `
                    gitlab_${index}_${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]}:repository(name: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 3]}", owner: "${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 4]}") {
                          issue(number: ${Number(groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1])}) {
                          url
                          title
                          body
                          state
                          author {
                              login
                              avatarUrl
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
                      'source': (groupedList as any).feedback.source
                    }
                    query = '';
                    queryList.push(githubQuery);
                  }
                } else if ((groupedList as any).feedback.source === 'JIRA') {
                  query += `${groupedList.ticketUrl.split('/')[groupedList.ticketUrl.split('/').length - 1]} `;
                  if (feedback[key].length === index + 1) {
                    const jiraQuery = {
                      'query': query,
                      'sourceUrl': key,
                      'source': (groupedList as any).feedback.source
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
            const selectedResponse = (responses.filter((response: any) => feedback.ticketUrl === (response.webUrl || response.url))[0] as any);
            feedback.state = selectedResponse.state;
            feedback.assignee = selectedResponse.assignee;
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
      let homeResponse: any;
      let apiResponse: any = {};
      let userQuery = `query ListUsers {
        rhatUUID_${(args.input.createdBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${args.input.createdBy}") {
          name
          title
          uid
          rhatUUID
        }
      }`;
      let userData = await FeedbackIntegrationHelper.getUserProfiles(userQuery);
      if (!args.input.config && args.input?.stackInfo?.path) {
        homeResponse = await FeedbackIntegrationHelper.listHomeType();
        homeResponse = homeResponse.filter((response: any) => response.link === `/${args.input.stackInfo.path.split('/')[1]}`)[0];
        args.input.config = homeResponse._id;
      } else if ((args.input.config && !args.input?.stackInfo?.path) || (args.input.config && args.input?.stackInfo?.path)) {
        let homeParam = {
          _id: args.input.config
        }
        homeResponse = await FeedbackIntegrationHelper.getHomeType(homeParam);
      }
      let descriptionTemplate = `
${(args.input?.error) ? `<br/>Error: ${args.input?.error}` : ``}
${(args.input?.stackInfo?.stack || args.input?.stackInfo?.path) ? `<br/><br/>
Browser Information<br/>
___________________<br/>
`: ``}
${(args.input?.stackInfo?.stack) ? `Stack - ${args.input?.stackInfo?.stack}<br/>` : ``}
${(args.input?.stackInfo?.path) ? `URL - ${args.input?.stackInfo?.path}<br/><br/>` : ``}
Reported by <br/>
Name - ${userData[0].name}  
`;
      if (!args.input.description) {
        args.input.description = descriptionTemplate;
      } else if (args.input.description) {
        args.input.description = args.input.description.concat(descriptionTemplate);
      }
      switch (homeResponse.feedback.source) {
        case 'GITHUB':
          let githubDescription = (args.input.description.concat(`UID - ${userData[0].uid}`))
          const query = {
            'githubIssueInput': {
              'title': args.input.summary,
              'body': githubDescription,
              'repositoryId': homeResponse.feedback.projectKey || process.env.PROJECT_KEY
            },
            'sourceUrl': homeResponse.feedback.sourceUrl
          };
          const githubResponse = await FeedbackIntegrationHelper.createGithubIssue(query);
          apiResponse = {
            ...args.input,
            ticketUrl: githubResponse.issue.url
          };
          break;
        case 'JIRA':
          let jiraDescription = (args.input.description.concat(`UID - [~${userData[0].uid}]`)).replace( /(<([^>]+)>)/ig, '');
          const jiraQuery = {
            'jiraIssueInput': {
              'fields': { 
                'project': {
                  'key': homeResponse.feedback.projectKey || process.env.PROJECT_KEY
                },
                'summary': args.input.summary  ,
                'description': jiraDescription,
                'labels': ['Reported-via-One-Platform'],
                'issuetype': {
                  'name': 'Task'
                },
              }
            },
            'sourceUrl': homeResponse.feedback.sourceUrl
          };
          const jiraResponse = await FeedbackIntegrationHelper.createJira(jiraQuery);
          apiResponse = {
            ...args.input,
            ticketUrl: `https://${homeResponse.feedback.sourceUrl || process.env.JIRA_HOST}/browse/${jiraResponse.key}`,
          };
          break;
        case 'GITLAB':
          let gitlabDescription = args.input.description.concat(`<br/>UID - @${userData[0].uid}`);
          const gitlabQuery: object = {
            'gitlabIssueInput': {
              'title': args.input.summary,
              'description': gitlabDescription,
              'projectPath': homeResponse.feedback.projectKey || process.env.PROJECT_KEY
            },
            'sourceUrl': homeResponse.feedback.sourceUrl
          }
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
          }
      }
      const emailBody = `
Hi ${userData[0].name},<br/><br/>
Please find the details of the feedback we recieved as below:<br/><br/>
Summary: ${apiResponse.summary}<br/><br/>
Description: ${apiResponse.description}<br/><br/>
You can track updates for your feedback at: ${apiResponse.ticketUrl}<br/><br/>

Thanks<br/><br/>

P.S.: This is an automated email. Please do not reply.
`;
      const emailData = {
        from: `noreply@redhat.com`,
        cc: `${userData[0].uid}@redhat.com`,
        to: process.env.EMAIL_ADDRESS,
        subject: `Thanks for submitting the ${apiResponse.category} ${(homeResponse.name) ? `for ${homeResponse.name}` : ''}.`,
        body: emailBody
      };
      FeedbackIntegrationHelper.sendEmail(emailData);
      apiResponse.description = apiResponse.description.replace( /(<([^>]+)>)/ig, '');
      return new Feedback(apiResponse).save()
        .then(async (response: any) => {
          response.createdBy = userData[0].name;
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
                  name
                  title
                  uid
                  rhatUUID
                }
                ${(feedback.updatedBy) ? `
                rhatUUID_${(feedback.updatedBy as string).replace(/-/g, '')}:getUsersBy(rhatUUID:"${feedback.updatedBy}") {
                  name
                  title
                  uid
                  rhatUUID
                }
              }
              `: ``}
              `;
              let userData = await FeedbackIntegrationHelper.getUserProfiles(userQuery);
              response.createdBy = userData.filter((user: any) => user.rhatUUID === feedback.createdBy)[0].name;
              response.updatedBy = userData.filter((user: any) => user.rhatUUID === feedback.updatedBy)[0].name;
              const formattedSearchResponse = FeedbackIntegrationHelper.formatSearchInput(response);
              FeedbackIntegrationHelper.manageSearchIndex(formattedSearchResponse, 'index');
              return feedback;
            });
        }).catch((err: Error) => err);
    },
    deleteFeedback(root: any, args: any, ctx: any) {
      return Feedback.findByIdAndRemove(args._id)
        .then((response: FeedbackType) => {
          let id = {
            'id': args._id
          };
          FeedbackIntegrationHelper.manageSearchIndex(id, 'delete');
          return response;
        })
        .catch((error: Error) => error);
    },
    updateFeedbackIndex(root: any, args: any, ctx: any) {
      let userQueryParams = ``;
      let searchInput: any = [];
      return Feedback.find()
        .then(async (response: any) => {
          if(response.length) {
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
          }
          `;
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
