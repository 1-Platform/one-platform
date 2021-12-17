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
