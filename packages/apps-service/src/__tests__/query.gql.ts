export const createProjectMutation = /* GraphQL */ `
  mutation ($project: CreateProjectInput!) {
    createProject (project: $project) {
      projectId
      name
      ownerId
      createdBy
      createdOn
    }
  }
`;

export const projectsQuery = /* GraphQL */`
  query {
    projects {
      projectId
      name
      ownerId
    }
  }
`;

export const myProjectsQuery = /* GraphQL */`
  query {
    myProjects {
      projectId
      name
      ownerId
    }
  }
`;

export const projectQuery = /* GraphQL */ `
  query ($projectId: ID!) {
    project(projectId: $projectId) {
      projectId
      name
      ownerId
    }
  }
`;

export const updateProjectMutation = /* GraphQL */ `
  mutation ($projectId: ID!, $project: UpdateProjectInput!) {
    updateProject(projectId: $projectId, project: $project) {
      projectId
      name
      description
    }
  }
`;

export const findProjectsQuery = /* GraphQL */`
  query ($selectors: FindProjectInput!) {
    findProjects (selectors: $selectors) {
      projectId
      name
    }
  }
`;

export const transferProjectOwnershipMutation = /* GraphQL */ `
  mutation ($projectId: ID!, $ownerId: String!) {
    transferProjectOwnership(projectId: $projectId, ownerId: $ownerId) {
      projectId
      ownerId
      permissions {
        refId
        role
      }
    }
  }
`;

export const deleteProjectMutation = /* GraphQL */`
  mutation ($projectId: ID!) {
    deleteProject (projectId: $projectId) {
      projectId
    }
  }
`;
