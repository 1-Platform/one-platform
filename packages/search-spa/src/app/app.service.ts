import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { search } from './app.gql';
import * as _ from 'lodash';
import { GraphQLModule } from './graphql.module';

@Injectable({
  providedIn: 'root'
})
export class AppService extends GraphQLModule {
  constructor(
    private apollo: Apollo,
  ) {
    super();
  }

  // GraphQL Query to fetch the results by search term
  search = ( searchTerm: string, start: number, rows: number ) => {
    return this.apollo.watchQuery<any>( {
      query: search,
      variables: {
        query: searchTerm,
        start,
        rows
      }
    } ).result().then( result => _.cloneDeep( result.data.search ) );
  }
}
