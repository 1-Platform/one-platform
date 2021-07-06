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
query FetchScore($auditId: String!) {
  fetchScore(auditId: $auditId) {
    performance
    accessibility
    bestPractices
    seo
    pwa
  }
}
`;

export const FetchProjectDetails = gql`
query FetchProjectDetails($serverBaseUrl: String, $buildToken: String!){
  fetchProjectDetails(serverBaseUrl: $serverBaseUrl, buildToken: $buildToken) {
    id
    name
    token
  }
}
`;

export const FetchProjects = gql`
query FetchProjects($serverBaseUrl: String) {
  fetchProjects(serverBaseUrl: $serverBaseUrl) {
    id
    name
    slug
  }
}
`;

export const FetchProjectLHR = gql`
query FetchProjectLHR(
  $serverBaseUrl: String
  $projectID: String!
  $buildID: String!
) {
  fetchProjectLHR(
    serverBaseUrl: $serverBaseUrl
    projectID: $projectID
    buildID: $buildID
  ) {
    performance
    accessibility
    bestPractices
    seo
    pwa
  }
}
`;

export const FetchProjectBuilds = gql`
query FetchProjectBuilds(
  $serverBaseUrl: String
  $projectID: String!
  $branch: String!
  $limit: Int!
) {
  fetchProjectBuilds(
    serverBaseUrl: $serverBaseUrl
    projectID: $projectID
    branch: $branch
    limit: $limit
  ) {
    id
    projectId
    branch
    runAt
  }
}
`;

export const FetchProjectBranches = gql`
query FetchProjectBranches($serverBaseUrl: String, $projectID: String!) {
  fetchProjectBranches(serverBaseUrl: $serverBaseUrl, projectID: $projectID) {
    branch
  }
}
`;

export const Upload = gql`
mutation Upload($property: LighthouseInput) {
  upload(property: $property)
}
`;
