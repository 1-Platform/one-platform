import {Apollo} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import { Injectable } from '@angular/core';
import { Feedback, FeedbacksResponse, FeedbackResponse } from './feedback';
import { listFeedback, getFeedback, getAllJiraIssues } from './feedback.gql';
import { GraphQLModule } from '../graphql.module';

@Injectable()
export class FeedbackService extends GraphQLModule {

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
  ) {
    super();
   }


  /**
   * Get all feedback
   */

  getAllFeedback() {
    return this.apollo
      .watchQuery<FeedbacksResponse>({
         query: listFeedback
       })
      .result()
      .then(result => result.data.listFeedback);
  }

  /**
   * Get all Feedback Issues from GitLab
   */

  getAllJiraIssues() {
    return this.apollo
      .watchQuery({
        query: getAllJiraIssues
      })
      .result()
      .then( (result: any) => result.data.getAllJiraIssues);
  }

  /**
   * Get feedback by id
   */

  getFeedback(id: string) {
    return this.apollo.watchQuery<FeedbackResponse>({
      variables: {
        _id: id
      },
      query: getFeedback
    }).result().then(result => result.data.getFeedback);
  }

}
