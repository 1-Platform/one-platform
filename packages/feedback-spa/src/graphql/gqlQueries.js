import gql from 'graphql-tag'

export const ListFeedbacks = gql`
  query ListFeedbacks {
    listFeedbacks {
      data {
        id
        summary
        module
        description
        experience
        error
        ticketUrl
        state
        source
        category
        assignee {
          name
          email
        }
        createdBy
        createdOn
        updatedOn
      }
    }
  }
`
