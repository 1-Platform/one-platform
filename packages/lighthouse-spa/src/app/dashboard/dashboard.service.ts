import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from '../graphql.module';
import { LeaderboardCategory } from '../leaderboard/enum';
import { map } from 'rxjs/operators';

import {
  ListLHProjects,
  ListLHProjectBranches,
  ListLHProjectScores,
  ListLHLeaderboard,
  ExportLHReportByProject,
} from './dashboard.gql';

@Injectable({
  providedIn: 'root',
})
export class DashboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  listLHProjects() {
    return this.apollo.query<{ listLHProjects: Pagination<LHProject[]> }>({
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
    branch: string,
    projectId: string,
    sort: Sort = 'DESC'
  ) {
    return this.apollo.query<{
      listLHLeaderboard: Pagination<LHLeaderboard[]>;
      getLHRankingOfAProjectBranch: LHLeaderboard;
    }>({
      query: ListLHLeaderboard,
      variables: {
        type,
        sort,
        limit: 5,
        offset: 0,
        branch,
        projectId,
      },
    });
  }

  exportLHReportByProject(projectId: string, branch: string) {
    return this.apollo
      .query<{ exportLHReportByProject: ExportLHReport[] }>({
        query: ExportLHReportByProject,
        variables: {
          projectId,
          branch,
        },
      })
      .pipe(map((result: any) => result.data.exportLHReportByProject));
  }
}
