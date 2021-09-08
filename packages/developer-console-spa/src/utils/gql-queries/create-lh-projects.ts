export const createLHProject = /* GraphQL */`
 mutation CreateLHProject($project: AddLHProjectInput!) {
  createLHProject(project: $project) {
    id
    name
    token
    adminToken
  }
}
`;
