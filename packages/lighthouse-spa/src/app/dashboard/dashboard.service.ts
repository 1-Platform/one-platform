import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import {
  FetchProperties,
  FetchProperty,
  FetchPropertyScore,
} from './dashboard.gql';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  fetchProperties() {
    return this.apollo.watchQuery<{ fetchProperties: Properties[] }>({
      query: FetchProperties,
    });
  }

  fetchProperty(propertyId: string) {
    return this.apollo.watchQuery<{ fetchProperty: Properties }>({
      query: FetchProperty,
      variables: {
        propertyId,
      },
    });
  }

  fetchScores(projectId: string, apps: PropertyApps[]) {
    return this.apollo.watchQuery<Record<string, PropertyBuilds[]>>({
      query: FetchPropertyScore(projectId, apps),
      variables: {
        projectId,
      },
    });
  }
}
