import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import * as _ from 'lodash';
import { AuditWebsite, Autorun } from './playground.gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaygroundService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  // Trigger to perform the audit for the website
  auditWebsite = (property) => {
    return this.apollo
      .mutate({
        mutation: AuditWebsite,
        variables: {
          property,
        },
      })
      .pipe(map((result: any) => result.data));
  };

  // Subscription to observe the changes on audit
  autorun(): Observable<any> {
    return this.apollo
      .subscribe({ query: Autorun })
      .pipe(map((result: any) => result.data.autorun));
  }
}
