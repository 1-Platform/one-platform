
import * as _ from 'lodash';
import { Feedback } from './schema';
const JiraApi = require('jira-client');
const fetch = require('node-fetch');
import { addFeedback } from './helpers';


export const FeedbackResolver = {
  Query: {
    listFeedback(root: any, args: any, ctx: any) {
      return Feedback.find()
        .sort({ 'timestamp': -1 })
        .then(response => {
          const createdBy = response.map(res => `rhatUUID_${res.createdBy}:getUsersBy(rhatUUID:"${res.createdBy}") { _id name title uid rhatUUID isActive}`);
          const updatedBy = response.map(res => `rhatUUID_${res.updatedBy}:getUsersBy(rhatUUID:"${res.updatedBy}") { _id name title uid rhatUUID isActive}`);
          const users = createdBy.concat(updatedBy);
          const formattedquery = 'query' + `{${users}}`;
          const graphql = JSON.stringify({
            query: formattedquery,
            variables: {}
          });
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: graphql
          };
          const graphql_api = `http://${process.env.USER_SERVICE_SERVICE_HOST}:${process.env.USER_SERVICE_SERVICE_PORT}/graphql`;
          return fetch(graphql_api, requestOptions)
            .then((result: any) => result.json())
            .then((output: any) => {
              const usersdata = output.data;
              return response.map(function (data: any) {
                const createdby = usersdata['rhatUUID_' + data['createdBy']][0];
                const updatedby = usersdata['rhatUUID_' + data['updatedBy']];
                return { ...{ ...data }._doc, createdBy: createdby, updatedBy: updatedby };
              });
            })
            .catch( ( error: any ) => { throw error; } );
        })
        .catch( ( error: any ) => { throw error; } );
    },

    getFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args.id)
        .then((response: any) => {
          if (response) {
            const createdBy = [`rhatUUID_${response.createdBy}:getUsersBy(rhatUUID:"${response.createdBy}") { _id name title uid rhatUUID isActive}`];
            const updatedBy = [`rhatUUID_${response.updatedBy}:getUsersBy(rhatUUID:"${response.updatedBy}") { _id name title uid rhatUUID isActive}`];
            const users = createdBy.concat(updatedBy);
            const formattedquery = 'query' + `{${users}}`;
            const graphql = JSON.stringify({
              query: formattedquery,
              variables: {}
            });
            const requestOptions = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: graphql
            };
            const graphql_api = `http://${process.env.USER_SERVICE_SERVICE_HOST}:${process.env.USER_SERVICE_SERVICE_PORT}/graphql`;
            return fetch(graphql_api, requestOptions)
              .then((result: any) => result.json())
              .then((output: any) => {
                const usersdata = output.data;
                const createdby = usersdata['rhatUUID_' + response['createdBy']][0];
                const updatedby = usersdata['rhatUUID_' + response['updatedBy']];
                return { ...{ ...response }._doc, createdBy: createdby, updatedBy: updatedby };
              })
              .catch( ( error: any ) => { throw error; } );
          }
        })
        .catch(err => err);
    },
    getFeedbackBy(root: any, args: any, ctx: any) {
      return Feedback.find(args.input)
        .sort({ 'timestamp': -1 })
        .then(response => {
          const createdBy = response.map(res => `rhatUUID_${res.createdBy}:getUsersBy(rhatUUID:"${res.createdBy}") { _id name title uid rhatUUID isActive}`);
          const updatedBy = response.map(res => `rhatUUID_${res.updatedBy}:getUsersBy(rhatUUID:"${res.updatedBy}") { _id name title uid rhatUUID isActive}`);
          const users = createdBy.concat(updatedBy);
          const formattedquery = 'query' + `{${users}}`;
          const graphql = JSON.stringify({
            query: formattedquery,
            variables: {}
          });
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: graphql
          };
          const graphql_api = `http://${process.env.USER_SERVICE_SERVICE_HOST}:${process.env.USER_SERVICE_SERVICE_PORT}/graphql`;
          return fetch(graphql_api, requestOptions)
            .then((result: any) => result.json())
            .then((output: any) => {
              const usersdata = output.data;
              return response.map(function (data: any) {
                const createdby = usersdata['rhatUUID_' + data['createdBy']][0];
                const updatedby = usersdata['rhatUUID_' + data['updatedBy']];
                return { ...{ ...data }._doc, createdBy: createdby, updatedBy: updatedby };
              });
            })
            .catch( ( error: any ) => { throw error; } );
        })
        .catch( ( error: any ) => { throw error; } );
    },
    getAllJiraIssues(root: any, args: any, ctx: any) {
      const jira = new JiraApi({
        protocol: 'https',
        host: process.env.JIRA_HOST,
        username: process.env.JIRA_USERNAME,
        password: process.env.JIRA_PASSWORD,
        apiVersion: '2',
        strictSSL: false
      });
      return jira.getIssuesForBoard(process.env.JIRA_BOARD_ID)
        .then(function (getIssuesForBoard: any) {
          return getIssuesForBoard['issues'].map((issue: any) => {
            issue['fields']['ticketID'] = issue['key'];
            return issue['fields'];
          });
        })
        .catch((err: any) => {
          throw err;
        });
    },

  },
  Mutation: {
    addFeedback(root: any, args: any, ctx: any) {
      const data = new Feedback(args.input);
      return data.save().then(response => {
        return Feedback.findById(response._id)
          .then(fb => {
            if (fb) {

              const issue = {
                'fields': {
                  'project': {
                    'key': process.env.PROJECT_KEY
                  },
                  'summary': fb.title,
                  'description': fb.description,
                  'issuetype': { 'name': 'Task' },
                }
              };
              const envpath = process.env.NODE_ENV;
              if (envpath === 'production') {
                addFeedback(issue).then((jira: any) => {
                  args.input.ticketID = jira.key;
                  return Feedback.update(fb, args.input).then((feedback: any) => feedback);
                })
                  .catch(function (err: any) {
                    return err;
                  });
              } else {
                return fb;
              }
            }
          });
      });
    },
    updateFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args.input._id).then(response => {
        return Object.assign(response, args.input).save().then((feedback: any) => {
          return feedback;
        });
      }).catch((err: any) => err);
    },
    deleteFeedback(root: any, args: any, ctx: any) {
      return Feedback.findByIdAndRemove(args.id)
        .then(response => response)
        .catch(err => err);
    },

  }
};
