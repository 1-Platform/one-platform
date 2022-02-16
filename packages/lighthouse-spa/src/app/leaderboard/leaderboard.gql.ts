import { gql } from 'apollo-angular';

export const ListLHLeaderboard = gql`
  query ListLHLeaderboard(
    $type: LHLeaderBoardCategory!
    $limit: Int
    $offset: Int
    $sort: Sort
    $search: String
  ) {
    listLHLeaderboard(
      type: $type
      limit: $limit
      offset: $offset
      sort: $sort
      search: $search
    ) {
      count
      rows {
        score {
          accessibility
          performance
          pwa
          bestPractices
          seo
        }
        rank
        branch
        project {
          name
        }
      }
    }
  }
`;
