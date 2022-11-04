export const newProject = /* GraphQL */ `
  mutation NewProject($project: CreateAppInput!) {
    project: createApp(app: $project) {
      appId
      name
      path
    }
  }
`;
