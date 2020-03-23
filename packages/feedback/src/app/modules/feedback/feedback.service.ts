import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Feedback, FeedbacksResponse, FeedbackResponse } from './feedback';
import { Apollo } from 'apollo-angular';
import { listFeedback, getFeedback } from './feedback.gql';
import { map } from 'rxjs/operators';

import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { GraphQLModule } from '../../apollo.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable()
export class FeedbackService extends GraphQLModule {

  // api path for GitLab
  private path = environment.api + '/api/gitlab/';

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink,
    private http: HttpClient
  ) {
    super(apollo, httpLink);
   }


  /**
   * Get all feedback
   */

  getAllFeedback() {
    return this.apollo.watchQuery<FeedbacksResponse>({ query: listFeedback }).result().then(result => result.data.listFeedback);
  }

  /**
   * Get all Feedback Issues from GitLab
   */

  getAllGitLabIssues(): Observable<any> {
    return this.http.get<any>(this.path + 'issues', httpOptions);
  }

  /**
   * Get feedback by id
   */

  getFeedback(_id: string) {
    return this.apollo.watchQuery<FeedbackResponse>({
      variables: {
        _id: _id
      },
      query: getFeedback
    }).result().then(result => result.data.getFeedback);
  }

}
