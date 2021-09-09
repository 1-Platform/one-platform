import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from 'app/graphql.module';
import { LeaderboardCategory } from './enum';
import { ListLHLeaderboard } from './leaderboard.gql';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService extends GraphQLModule {
  constructor(private apollo: Apollo) {
    super();
  }

  listLHLeaderboard(
    type: LeaderboardCategory,
    sort: Sort = 'DESC',
    limit = 10,
    offset = 0
  ) {
    return this.apollo.watchQuery<{
      listLHLeaderboard: Pagination<LHLeaderboard[]>;
    }>({
      query: ListLHLeaderboard,
      variables: {
        type,
        sort,
        limit,
        offset,
      },
    });
  }
}
