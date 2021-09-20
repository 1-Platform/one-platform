export const listLHProjects = /* GraphQL */`
 query ListLHProjects($limit: Int!) {
  listLHProjects(limit: $limit) {
    rows {
      name
      token
      id
      adminToken
    }
  }
}
`;
