export const projectByProjectId = /* GraphQL */`
query ($projectId: ID!) {
  project ( projectId: $projectId ) {
    name
    projectId
    description
    ownerId
    createdOn
    createdBy
    updatedOn
    updatedBy
    database {
      isEnabled
      databases {
        name
        description
        permissions {
          admins
          users
        }
      }
    }
  }
}
`;
