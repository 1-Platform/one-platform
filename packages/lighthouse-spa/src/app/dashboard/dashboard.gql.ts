import { gql } from 'apollo-angular';

export const ListLHProjects = gql`
  query ListLHProjects($limit: Int!) {
    listLHProjects(limit: $limit) {
      count
      rows {
        id
        name
      }
    }
  }
`;

export const ListLHProjectBranches = gql`
  query ListLHProjectBranches($projectId: String!) {
    listLHProjectBranches(projectId: $projectId) {
      count
      rows {
        branch
      }
    }
  }
`;

export const ListLHProjectScores = gql`
  query ListLHPropertyScores(
    $projectId: String!
    $branch: String!
    $limit: Int!
  ) {
    listLHProjectBuilds(projectId: $projectId, branch: $branch, limit: $limit) {
      id
      projectId
      updatedAt
      score {
        pwa
        accessibility
        seo
        bestPractices
        performance
      }
    }
  }
`;

export const ListLHLeaderboard = gql`
  query ListLHLeaderboard(
    $type: LHLeaderBoardCategory!
    $buildId: String!
    $projectId: String!
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
        score {
          accessibility
          performance
          pwa
          bestPractices
          seo
        }
        rank
        build {
          branch
        }
        project {
          name
        }
      }
    }
    getLHRankingOfABuild(
      type: $type
      projectId: $projectId
      buildId: $buildId
      sort: $sort
    ) {
      score {
        accessibility
        performance
        pwa
        bestPractices
        seo
      }
      rank
      build {
        branch
      }
      project {
        name
      }
    }
  }
`;
