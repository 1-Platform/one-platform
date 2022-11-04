export const getAppFeedbacks = /* GraphQL */ `
  query listFeedbacks(
    $appId: [String]
    $search: String
    $limit: Int
    $offset: Int
    $sortBy: FeedbackSortType
  ) {
    listFeedbacks(
      appId: $appId
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
