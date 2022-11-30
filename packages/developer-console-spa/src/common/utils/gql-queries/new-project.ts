export const newProject = /* GraphQL */ `
  mutation ($project: CreateProjectInput!) {
    project: createProject(project: $project) {
      projectId
      name
    }
  }
`;
