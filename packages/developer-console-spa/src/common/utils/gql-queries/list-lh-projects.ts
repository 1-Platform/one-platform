export const listLHProjects = /* GraphQL */`
 query ($limit: Int!) {
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
