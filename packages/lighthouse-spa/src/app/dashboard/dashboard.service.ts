import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import {
  ListLHProperties,
  GetLHPropertyById,
  ListLHPropertyScores,
} from './dashboard.gql';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  listLHProperties() {
    return this.apollo.watchQuery<{ listLHProperties: Properties[] }>({
      query: ListLHProperties,
    });
  }

  getLHPropertyById(propertyId: string) {
    return this.apollo.watchQuery<{ getLHPropertyById: Properties }>({
      query: GetLHPropertyById,
      variables: {
        propertyId,
      },
    });
  }

  getLHPropertyScores(projectId: string, apps: PropertyApps[]) {
    return this.apollo.watchQuery<Record<string, PropertyBuilds[]>>({
      query: ListLHPropertyScores(projectId, apps),
      variables: {
        projectId,
      },
    });
  }
}
