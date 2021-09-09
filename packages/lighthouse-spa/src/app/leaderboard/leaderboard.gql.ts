import { gql } from 'apollo-angular';

export const ListLHLeaderboard = gql`
  query ListLHLeaderboard(
    $type: LHLeaderBoardCategory!
    $limit: Int
    $offset: Int
    $sort: Sort
  ) {
    listLHLeaderboard(
      type: $type
      limit: $limit
      offset: $offset
      sort: $sort
    ) {
      count
      rows {
        score
        rank
        build {
          branch
        }
        project {
          name
        }
      }
    }
  }
`;
