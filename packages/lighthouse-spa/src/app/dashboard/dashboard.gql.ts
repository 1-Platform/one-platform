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

export const ListLHProjectScores = (
  projectId: string,
  branches: string[],
  limit = 10
) => {
  let queryAliasBuilder = '';
  branches.map((branch, index) => {
    queryAliasBuilder += `
    branch${index}:listLHProjectBuilds(projectId:$projectId,branch:"${branch}",limit:${limit}){
      id
      projectId
      updatedAt
      score{
        pwa
        accessibility
        seo
        bestPractices
        performance
      }
    }
    `;
  });
  return gql`
  query ListLHPropertyScores($projectId: String!) {
    ${queryAliasBuilder}
  }
  `;
};
