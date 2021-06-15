export const myApps = /* GraphQL */`
query AppsList {
  myApps {
    id
    name
    path
    description
    owner
    isActive
    updatedOn
  }
}`;
