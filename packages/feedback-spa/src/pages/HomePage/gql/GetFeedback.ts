export const GetFeedback = `
query GetFeedbackById($id: ID!) {
  getFeedbackById(id: $id) {
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
}`;
