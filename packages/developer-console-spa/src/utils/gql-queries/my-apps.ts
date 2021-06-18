export const myApps = /* GraphQL */`
query AppsList {
  myApps {
    id
    appId
    name
    path
    description
    ownerId
    isActive
    updatedOn
  }
}`;
