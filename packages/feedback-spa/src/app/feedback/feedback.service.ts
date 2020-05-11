import { Injectable } from '@angular/core';
import { Feedback, FeedbacksResponse, FeedbackResponse } from './feedback';
import { Apollo } from 'apollo-angular';
import { listFeedback, getFeedback, getAllJiraIssues } from './feedback.gql';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { GraphQLModule } from '../apollo.config';

@Injectable()
export class FeedbackService extends GraphQLModule {

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
  ) {
    super(apollo, httpLink);
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

  getFeedback(_id: string) {
    return this.apollo.watchQuery<FeedbackResponse>({
      variables: {
        _id
      },
      query: getFeedback
    }).result().then(result => result.data.getFeedback);
  }

}
