import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from './graphql.module';
import * as _ from 'lodash';
import { AuditWebsite, Autorun, FetchProjectDetails, FetchScore, FetchProjectLHR, FetchProjects, FetchProjectBranches, Upload } from './app.gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService extends GraphQLModule {

  constructor(
    private apollo: Apollo,
  ) {
    super();
  }

  // Trigger to perform the audit for the website
  auditWebsite = (property) => {
    return this.apollo.mutate({
      mutation: AuditWebsite,
      variables: {
        property
      }
    }).pipe(map((result: any) => result.data));
  }

  // Subscription to observe the changes on audit
  autorun(): Observable<any> {
    return this.apollo.subscribe({ query: Autorun })
      .pipe(map((result: any) => result.data.autorun));
  }

  // Fetch score of the lighthouse result.
  fetchScore = (auditId) => {
    return this.apollo.watchQuery<any>({
      query: FetchScore,
      variables: {
        auditId
      }
    }).result().then(result => _.cloneDeep(result.data.listLHScore));
  }

  // Fetch & Verify Project details of valid project
  fetchProjects = (serverBaseUrl) => {
    return this.apollo.watchQuery<any>({
      query: FetchProjects,
      variables: {
        serverBaseUrl
      }
    }).result().then(result => _.cloneDeep(result.data));
  }

  // Fetch & Verify Project details of valid project
  fetchProjectDetails = (serverBaseUrl, buildToken) => {
    return this.apollo.watchQuery<any>({
      query: FetchProjectDetails,
      variables: {
        serverBaseUrl,
        buildToken
      }
    }).result().then(result => _.cloneDeep(result.data));
  }

  // Fetch lighthouse report(lhr) from server.
  fetchProjectLHR = (serverBaseUrl, projectID, buildID) => {
    return this.apollo.watchQuery<any>({
      query: FetchProjectLHR,
      variables: {
        serverBaseUrl,
        projectID,
        buildID
      }
    }).result().then(result => _.cloneDeep(result.data));
  }

  // Fetch the branches of a project.
  fetchProjectBranches = (serverBaseUrl, projectID) => {
    return this.apollo.watchQuery<any>({
      query: FetchProjectBranches,
      variables: {
        serverBaseUrl,
        projectID
      }
    }).result().then(result => _.cloneDeep(result.data));
  }

  // Upload result to lighthouse server.
  upload = (property) => {
    return this.apollo.mutate({
      mutation: Upload,
      variables: {
        property
      }
    }).pipe(map((result: any) => result.data));
  }

}
