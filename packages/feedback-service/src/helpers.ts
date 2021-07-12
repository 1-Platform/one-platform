import JiraApi from 'jira-client';
const fetch = require('node-fetch');
import * as _ from 'lodash';
const nodemailer = require('nodemailer');

(global as any).Headers = fetch.Headers;

class FeedbackHelper {
    private static FeedbackHelperInstance: FeedbackHelper;
    constructor() { }
    public static feedbackHelper() {
        if (!FeedbackHelper.FeedbackHelperInstance) {
            FeedbackHelper.FeedbackHelperInstance = new FeedbackHelper();
        }
        return FeedbackHelper.FeedbackHelperInstance;
    }

    public createGithubIssue(query: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: `mutation CreateGithubIssue($input: CreateIssueInput!) {
                        createIssue(input: $input) {
                            issue {
                                title
                                body
                                url
                                state
                                createdAt
                                author {
                                    login
                                }
                            }
                        }
                    }`,
            variables: {
                'input': query.githubIssueInput
            }
        });
        headers.append(`Authorization`, `${process.env.GITHUB_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${query.sourceUrl || process.env.GITHUB_API}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => result.data.createIssue)
            .catch((err: any) => {
                throw err;
            });
    }

    public createJira(query: any) {
        const JiraApiClient = new JiraApi({
            protocol: 'https',
            host: `${query.sourceUrl || process.env.JIRA_HOST}`,
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
            apiVersion: '2',
            strictSSL: false
        });
        return JiraApiClient.addNewIssue(query.jiraIssueInput).catch(err => {
            throw err.message
        });
    }

    public createGitlabIssue(query: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: `mutation CreateGitlabIssue($input: CreateIssueInput!) {
                        createIssue(input: $input) {
                                issue {
                                    title
                                    webUrl
                                    description
                                    labels {
                                        edges {
                                            node {
                                                title
                                            }
                                        }
                                    }
                                    author {
                                        name
                                        email
                                        webUrl
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
                        }`,
            variables: {
                'input': query.gitlabIssueInput
            }
        });

        headers.append(`Authorization`, `${process.env.GITLAB_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${query.sourceUrl || process.env.GITLAB_API}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => {
                result.data.createIssue.issue.labels = result?.data?.createIssue?.issue?.labels?.edges.map((label: any) => label.node.title);
                return result.data.createIssue.issue;
            })
            .catch((err: any) => {
                throw err;
            });

    }

    public listApps() {
        let headers = new Headers();
        let body = JSON.stringify({
            query: `query Apps {
                apps {
                  id
                  appId
                  path
                  name
                  feedback {
                    sourceType
                    isEnabled
                    sourceApiUrl
                    sourceHeaders {
                      key
                      value
                    }
                    projectKey
                    feedbackEmail
                  }
                }
              }`,
            variables: null
        });
        headers.append(`Authorization`, `${process.env.GATEWAY_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${process.env.API_GATEWAY}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => result.data.apps)
            .catch((err: any) => {
                throw err;
            });
    }

    public getApp(params: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: `
            query FindApps($id: ID) {
                findApps(selectors: { id: $id }) {
                  id
                  path
                  name
                  feedback {
                    sourceType
                    isEnabled
                    sourceApiUrl
                    projectKey
                    feedbackEmail
                  }
                }
              }`,
            variables: params
        });
        headers.append(`Authorization`, `${process.env.GATEWAY_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${process.env.API_GATEWAY}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => result.data.app)
            .catch((err: any) => {
                throw err;
            });
    }

    public getUserProfiles(userQuery: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: userQuery,
            variables: null
        });
        headers.append(`Authorization`, `${process.env.GATEWAY_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${process.env.API_GATEWAY}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((result: any) => {
                return Object.keys(result.data).map(key => result.data[key][0]);
            })
            .catch((err: any) => {
                throw err;
            });
    }

    public listGitlabIssues(gitlabQuery: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: gitlabQuery.query,
            variables: null
        });
        headers.append(`Authorization`, `${process.env.GITLAB_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${gitlabQuery.sourceUrl || process.env.GITLAB_API}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((response: any) => {
                return Object.keys(response.data).map(key => {
                    response.data[key].issue.labels = response.data[key].issue.labels.edges.map((edge: any) => edge.node.title);
                    response.data[key].issue.assignee = {
                        name: response.data[key]?.issue?.assignees?.nodes[0]?.name || null,
                        email: response.data[key]?.issue?.assignees?.nodes[0]?.email || null,
                        url: response.data[key]?.issue?.assignees?.nodes[0]?.webUrl || null
                    };
                    return response.data[key]?.issue;
                });
            })
            .catch((err: any) => {
                throw err;
            });
    }

    public listGithubIssues(githubQuery: any) {
        let headers = new Headers();
        let body = JSON.stringify({
            query: githubQuery.query,
            variables: null
        });
        headers.append(`Authorization`, `${process.env.GITHUB_AUTH_TOKEN}`);
        headers.append(`Content-Type`, `application/json`);
        return fetch(`${githubQuery.sourceUrl || process.env.GITHUB_API}`, {
            method: `POST`,
            headers,
            body: body,
        }).then((response: any) => response.json())
            .then((response: any) => {
                return Object.keys(response.data).map(key => {
                    response.data[key].issue.assignee = {
                        name: response.data[key]?.issue?.assignees?.nodes[0]?.name || null,
                        email: response.data[key]?.issue?.assignees?.nodes[0]?.email || null,
                        url: response.data[key]?.issue?.assignees?.nodes[0]?.url || null
                    };
                    return response.data[key].issue
                });
            })
            .catch((err: any) => {
                throw err;
            });
    }

    public listJira(jiraQuery: any) {
        const JiraApiClient = new JiraApi({
            protocol: 'https',
            host: `${jiraQuery.sourceUrl || process.env.JIRA_HOST}`,
            username: process.env.JIRA_USERNAME,
            password: process.env.JIRA_PASSWORD,
            apiVersion: '2',
            strictSSL: false
        });
        return JiraApiClient.searchJira(`issue = ${jiraQuery.query}`).then(response => {
            const jiraList: Array<any> = [];
            response?.issues?.map((jira: any) => {
                jiraList.push({
                    'key': jira.key,
                    'url': `${(new URL(jira.self)).origin}/browse/${jira.key}`,
                    'lastUpdated': jira.fields.updated,
                    'summary': jira.fields.summary,
                    'description': jira.fields.description,
                    'state': jira.fields?.status?.name,
                    'assignee': {
                        'name': jira.fields?.assignee?.displayName || null,
                        'email': jira.fields?.assignee?.emailAddress || null,
                        'uid': jira.fields?.assignee?.name || null,
                    }
                });
            });
            return jiraList;
        }).catch((err: Error) => {
            console.error(err.message);
            return [];
        });
    }

    public sendEmail(data: any) {
        transporter.sendMail({
            from: data.from,
            to: data.to,
            cc: data.cc,
            subject: data.subject,
            html: data.body
        }, (err: Error) => {
            if (err) {
                console.error(err.message);
            } else {
                return { 'message': 'Email Sent' };
            }
        });
    }

    // Helper function to format data for feedback tool for search
    public formatSearchInput(data: any) {
        return {
            'input': {
                'dataSource': 'oneportal',
                'documents': {
                    'id': `${data._id}`,
                    'title': data.summary,
                    'abstract': data.description,
                    'description': data.description,
                    'icon': `assets/icons/feedback.svg`,
                    'uri': `${process.env.FEEDBACK_CLIENT}`,
                    'tags': `Feedback, ${data?.category}`,
                    'contentType': 'Feedback',
                    'createdBy': data?.createdBy || '',
                    'createdDate': data?.createdOn || new Date(),
                    'lastModifiedBy': data?.updatedBy || '',
                    'lastModifiedDate': data?.updatedOn || new Date()
                }
            }
        }
    }

    // Helper function to create/update/delete data to feedback microservice
    public manageSearchIndex ( data: any, mode: string ) {
        let query: string = `
                mutation ManageIndex($input: SearchInput, $mode: String) {
                    manageIndex(input: $input, mode: $mode) {
                        status
                    }
                }
            `;
        let headers = new Headers();
        headers.append( `Authorization`, `${ process.env.GATEWAY_AUTH_TOKEN }` );
        headers.append( `Content-Type`, `application/json` );
        return fetch( `${ process.env.API_GATEWAY }`, {
            method: `POST`,
            headers,
            body: JSON.stringify({
                query: query,
                variables: {
                    input: mode === 'index'? data?.input : data,
                    mode
                }
            } ),
        } ).then( ( response: any ) => {
            return response.json();
        } )
            .then( ( result: any ) => {
                const succesStatusCodes = [ 200, 204 ];
                if ( succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Sucessfully completed the index updation.')
                } else if ( !succesStatusCodes.includes(result.data?.manageIndex?.status) ) {
                    console.info('Error in index updation.');
                }
            })
            .catch((err: Error) => {
                throw err;
            });
    }
}

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    logger: true,
    debug: false
});

export const FeedbackIntegrationHelper = FeedbackHelper.feedbackHelper();
