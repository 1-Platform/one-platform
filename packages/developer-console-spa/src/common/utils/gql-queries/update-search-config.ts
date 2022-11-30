export const updateSearchMap = /* GraphQL */ `
  mutation (
    $projectId: String!
    $searchMap: UpdateSearchMapInput!
  ) {
    updateSearchMap(appId: $projectId, searchMap: $searchMap) {
      projectId: appId
    }
  }
`;
