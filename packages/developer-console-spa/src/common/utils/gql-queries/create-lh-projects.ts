export const createLHProject = /* GraphQL */`
 mutation ($project: AddLHProjectInput!) {
  createLHProject(project: $project) {
    id
    name
    token
    adminToken
  }
}
`;
