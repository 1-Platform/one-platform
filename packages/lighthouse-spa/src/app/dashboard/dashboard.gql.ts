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
