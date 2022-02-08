import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import { LeaderboardCategory } from 'app/leaderboard/enum';

import {
  ListLHProjects,
  ListLHProjectBranches,
  ListLHProjectScores,
  ListLHLeaderboard,
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
    return this.apollo.query<{ listLHProjectBuilds: ProjectBranch[] }>({
      query: ListLHProjectScores,
      variables: {
        projectId,
        branch,
        limit,
      },
    });
  }

  listLHLeaderboard(
    type: LeaderboardCategory,
    buildId: string,
    projectId: string,
    sort: Sort = 'DESC'
  ) {
    return this.apollo.query<{
      listLHLeaderboard: Pagination<LHLeaderboard[]>;
      getLHRankingOfABuild: LHLeaderboard;
    }>({
      query: ListLHLeaderboard,
      variables: {
        type,
        sort,
        limit: 5,
        offset: 0,
        buildId,
        projectId,
      },
    });
  }
}
