import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import {
  ListLHProjects,
  ListLHProjectBranches,
  ListLHProjectScores,
} from './dashboard.gql';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  listLHProjects() {
    return this.apollo.watchQuery<{ listLHProjects: Pagination<LHProject[]> }>({
      query: ListLHProjects,
      variables: {
        limit: 10000,
      },
    });
  }

  listLHProjectBranches(projectId: string) {
    return this.apollo.watchQuery<{
      listLHProjectBranches: Pagination<{ branch: string }[]>;
    }>({
      query: ListLHProjectBranches,
      variables: {
        projectId,
      },
    });
  }

  ListLHProjectScores(projectId: string, branch: string, limit = 10) {
    return this.apollo.watchQuery<{ listLHProjectBuilds: ProjectBranch[] }>({
      query: ListLHProjectScores,
      variables: {
        projectId,
        branch,
        limit,
      },
    });
  }
}
