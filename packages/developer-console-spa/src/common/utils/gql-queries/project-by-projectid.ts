export const projectByProjectId = /* GraphQL */`
query App($projectId: String!) {
  project: app ( appId: $projectId ) {
    id
    name
    projectId: appId
    path
    description
    ownerId
    isActive
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
