import * as _ from "lodash";
import { Feedback } from './schema';
const JiraApi = require('jira-client');

export const FeedbackResolver = {
  Query: {
    listFeedback(root: any, args: any, ctx: any) {
      return Feedback.find()
        .sort({ "timestamp": -1 })
        .then(response => response)
        .catch(err => err);
    },
    getFeedback(root: any, args: any, ctx: any) {
      return Feedback.findById(args.id)
        .then(response => response)
        .catch(err => err);
    },
    getFeedbackBy(root: any,  args : any, ctx: any){
      return Feedback.find(args.input).exec();
    },
    getAllJiraIssues(root: any,  args : any, ctx: any) {
    const jira = new JiraApi({
    protocol: 'https',
    host: process.env.JIRA_HOST,
    username: process.env.JIRA_USERNAME,
    password: process.env.JIRA_PASSWORD,
    apiVersion: '2',
    strictSSL: false
   });
   return  jira.getIssuesForBoard("3844")
      .then(function(getIssuesForBoard: any){
      return getIssuesForBoard['issues'].map( (issue: any) => {
          issue['fields']['ticketID'] = issue['key'];
          return issue['fields']
          }) 
      })
      .catch((err:any) => err);          
  },

  },
  Mutation: {
    addFeedback(root: any, args: any, ctx: any) {
      const data = new Feedback(args.input);
      return data.save();
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
}
