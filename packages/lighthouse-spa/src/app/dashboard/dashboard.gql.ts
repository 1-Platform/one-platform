import { gql } from 'apollo-angular';

export const ListLHProperties = gql`
  query ListLHProperties {
    listLHProperties {
      id
      name
    }
  }
`;

export const GetLHPropertyById = gql`
  query GetLHPropertyById($propertyId: ID!) {
    getLHPropertyById(id: $propertyId) {
      projectId
      name
      apps {
        id
        branch
        name
      }
    }
  }
`;

export const ListLHPropertyScores = (
  projectId: string,
  apps: PropertyApps[]
) => {
  let queryAliasBuilder = '';
  apps.map(({ branch, id }) => {
    queryAliasBuilder += `
    app${id}:listLHProjectBuilds(projectID:$projectId,branch:"${branch}",limit:1){
      id
      projectId
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
