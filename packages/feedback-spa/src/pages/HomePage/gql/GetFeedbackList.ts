export const GetFeedbackList = `
query ListFeedbacks($status: FeedbackStatus, $category: [FeedbackCategory], $appId: [String], $search: String, $createdBy: String, $limit: Int, $offset: Int) {
  listFeedbacks(status: $status, category: $category, appId: $appId,search: $search, createdBy: $createdBy, limit: $limit, offset: $offset) {
    count
    data{
      id
      module
      summary
      description
      experience
      error
      category
      createdOn
      createdBy{
        cn
        mail
      }
      module
      state
      stackInfo{
        stack
        path
      }
      assignee{
        name
      }
      source
      ticketUrl
    }
  }
}`;
