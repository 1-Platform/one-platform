export const getProjectFeedbacks = /* GraphQL */ `
  query (
    $projectId: [String]
    $search: String
    $limit: Int
    $offset: Int
    $sortBy: FeedbackSortType
  ) {
    listFeedbacks(
      appId: $projectId
      search: $search
      limit: $limit
      offset: $offset
      sortBy: $sortBy
    ) {
      count
      data {
        id
        summary
        category
        experience
        createdBy {
          cn
        }
      }
    }
  }
`;
