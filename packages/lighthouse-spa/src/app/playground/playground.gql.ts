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

export const VerifyLHProjectDetails = gql`
  query VerifyLHProjectDetails($serverBaseUrl: String, $buildToken: String!) {
    verifyLHProjectDetails(
      serverBaseUrl: $serverBaseUrl
      buildToken: $buildToken
    ) {
      id
      name
      token
    }
  }
`;

export const FetchProjects = gql`
  query listLHProjects {
    listLHProjects {
      count
      rows {
        id
        name
        slug
      }
    }
  }
`;

export const FetchProjectLHR = gql`
  query FetchProjectLHR(
    $serverBaseUrl: String
    $projectID: String!
    $buildID: String!
  ) {
    listProjectLHReport(
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
    listLHProjectBuilds(
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
  query FetchProjectBranches($projectId: String!) {
    listLHProjectBranches(projectId: $projectId) {
      count
      rows {
        branch
      }
    }
  }
`;
