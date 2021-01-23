import gql from 'graphql-tag'

export const ListFeedbacks = gql`
  query ListFeedbacks {
  listFeedbacks {
    _id
    summary
    module
    description
    experience
    ticketUrl
    state
    source
    category
    assignee {
      name
      email
      url
    }
    createdBy {
      name
      uid
    }
    updatedBy {
      name
      uid
    }
    createdOn
    updatedOn
  }
}`
