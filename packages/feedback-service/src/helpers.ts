import { RedisPubSub } from 'graphql-redis-subscriptions';	
import { resolve } from 'dns';
import { rejects } from 'assert';
export const pubsub = new RedisPubSub();
const JiraApi = require('jira-client');

const JiraObj = new JiraApi({
    protocol: 'https',
    host: process.env.JIRA_HOST,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PWD,
    apiVersion: '2',
    strictSSL: false
});

export function addFeedback(issue){
     JiraObj.addNewIssue(issue)
     .then(function(response){
        return response;
     })
     .catch(function(err){
         return err;
     })     
 }
