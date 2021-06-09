import gql from 'graphql-tag';

export const AuditWebsite = gql`
  mutation AuditWebsite($property: LighthouseInput) {
    auditWebsite(property: $property)
  }
`;

export const Autorun = gql`
  subscription Autorun {
    autorun
  }
`;

export const FetchScore = gql`
query FetchScore($projectID: String!, $buildID: String!) {
  fetchScore(projectID: $projectID, buildID: $buildID) {
    performance
    accessibility
    bestPractices
    seo
    pwa
  }
}
`;

export const FetchProjectDetails = gql`
  query FetchProjectDetails($buildToken: String!){
  fetchProjectDetails(buildToken: $buildToken) {
    id
    name
    token
  }
}

`;
