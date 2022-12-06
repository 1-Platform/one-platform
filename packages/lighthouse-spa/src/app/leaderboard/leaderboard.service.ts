import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphQLModule } from '../graphql.module';
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
    search = '',
    limit = 10,
    offset = 0,
    pickCategory?: LeaderboardCategory[]
  ) {
    return this.apollo.query<{
      listLHLeaderboard: Pagination<LHLeaderboard[]>;
    }>({
      query: ListLHLeaderboard,
      variables: {
        type,
        sort,
        limit,
        offset,
        search,
        pickCategory,
      },
    });
  }
}
