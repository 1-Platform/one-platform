export const myProjects = /* GraphQL */`
query AppsList {
  myProjects: myApps {
    id
    projectId: appId
    name
    path
    description
    ownerId
    isActive
    updatedOn
  }
}`;
