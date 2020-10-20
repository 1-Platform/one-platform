import gql from 'graphql-tag';


export const manageIndex = gql`
  mutation manageIndex ($input: SearchInput!) {
    manageIndex (input: $input) {
      status
    }
  }
`;


export const search = gql`
  query search($query: String, $start: Int, $rows:Int) {
    search(query: $query, start:$start, rows:$rows) {
      responseHeader{
        zkConnected
        status
        QTime
      }
      response {
        numFound
        start
        docs {
          id
          title
          abstract
          description
          content_type
          icon
          uri
          tags
          timestamp
          createdDate
          createdBy
          lastModifiedDate
          lastModifiedBy
        }
      }
    }
  }
`;
