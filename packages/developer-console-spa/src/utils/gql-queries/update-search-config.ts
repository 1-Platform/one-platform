export const updateSearchMap = /* GraphQL */ `
  mutation UpdateSearchMap(
    $appId: String!
    $searchMap: UpdateSearchMapInput!
  ) {
    updateSearchMap(appId: $appId, searchMap: $searchMap) {
      appId
    }
  }
`;
