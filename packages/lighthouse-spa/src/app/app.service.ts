import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from './graphql.module';
import * as _ from 'lodash';
import { AuditWebsite, Autorun, FetchProjectDetails, FetchScore } from './app.gql';
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
  auditWebsite = ( property) => {
    return this.apollo.mutate( {
      mutation: AuditWebsite,
      variables: {
        property
      }
    } ).pipe( map( ( result: any ) => result.data ) );
  }

  // Subscription to observe the changes on audit
  autorun(): Observable<any> {
    return this.apollo.subscribe( { query: Autorun } )
      .pipe( map( ( result: any ) => result.data.autorun ) );
  }

  // Fetch score of the lighthouse result.
  fetchScore = ( projectID, buildID ) => {
    return this.apollo.watchQuery<any>( {
      query: FetchScore,
      variables: {
        projectID,
        buildID
      }
    } ).result().then( result => _.cloneDeep( result.data.fetchScore ) );
  }

  // Fetch score of the lighthouse result.
  fetchProjectDetails = ( buildToken ) => {
    return this.apollo.watchQuery<any>( {
      query: FetchProjectDetails,
      variables: {
        buildToken
      }
    } ).result().then( result => _.cloneDeep( result.data ) );
  }

}
