import { gql } from 'apollo-angular';

export const FetchProperties = gql`
  query FetchProperties {
    fetchProperties {
      id
      name
    }
  }
`;

export const FetchProperty = gql`
  query FetchProperty($propertyId: ID!) {
    fetchProperty(id: $propertyId) {
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

export const FetchPropertyScore = (projectId: string, apps: PropertyApps[]) => {
  let queryAliasBuilder = '';
  apps.map(({ branch, id }) => {
    queryAliasBuilder += `
    app${id}:fetchProjectBuilds(projectID:$projectId,branch:"${branch}",limit:1){
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
  query FetchProperyScores($projectId: String!) {
    ${queryAliasBuilder}
  }
  `;
};
