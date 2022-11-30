import { ApolloServer } from 'apollo-server-express';
import { schema } from '../app';
import {
  disconnectMockDatabase,
  setupMockDatabase,
} from './mocks/mockDatabase';
import { createProjectMutation, deleteProjectMutation, findProjectsQuery, myProjectsQuery, projectQuery, projectsQuery, transferProjectOwnershipMutation, updateProjectMutation } from './query.gql';

let server: ApolloServer;
let projectName = 'Test-Project-' + Math.round(Math.random() * 50);
let projectId = '';
let originalUserId = 'some-user-id';
let newUserId = 'new-user-id';

jest.mock('../utils/apps-helper', () => ({
  manageSearchIndex: jest.fn(),
  formatSearchInput: jest.fn(),
}));
jest.mock('../services/user-group', () => ({
  getUser: jest.fn((userId: string) => ({
    uuid: userId,
    name: 'User ' + userId,
    email: userId + '@example.com',
  })),
}));

beforeAll(async () => {
  await setupMockDatabase();
});
afterAll(async () => {
  await disconnectMockDatabase();
});
beforeEach(() => {
  server = new ApolloServer({
    schema: schema,
    context: {
      userId: originalUserId,
    },
  });
});

describe('Projects Queries and Mutations Test', () => {
  it('should create a new project', async () => {
    const result = await server.executeOperation({
      query: createProjectMutation,
      variables: {
        project: {
          name: projectName,
          description: 'Lorem ipsum dolor sit amet',
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('createProject');
    expect(result.data?.createProject).toBeTruthy();
    expect(result.data?.createProject).toHaveProperty('projectId');
    expect(result.data?.createProject).toHaveProperty('name', projectName);
    expect(result.data?.createProject).toHaveProperty('ownerId', originalUserId);
    expect(result.data?.createProject).toHaveProperty('createdBy', originalUserId);
    expect(result.data?.createProject).toHaveProperty('createdOn');
    expect(Date.parse(result.data?.createProject.createdOn)).not.toBeNaN();

    /* Storing the projectId for other tests cases */
    projectId = result.data?.createProject.projectId;
  });

  it('should list all Projects', async () => {
    const result = await server.executeOperation({
      query: projectsQuery,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('projects');
    expect(Array.isArray(result.data?.projects)).toBe(true);
    expect(result.data?.projects.length).toBeGreaterThanOrEqual(1);

    result.data?.projects.map((project: Project) => {
      expect(project).toHaveProperty('projectId');
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('ownerId');
    });
  });

  it('should list the projects of the user: ' + originalUserId, async () => {
    const result = await server.executeOperation({
      query: myProjectsQuery,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('myProjects');
    expect(Array.isArray(result.data?.myProjects)).toBe(true);
    expect(result.data?.myProjects.length).toBeGreaterThanOrEqual(1);

    result.data?.myProjects.map((app: any) => {
      expect(app).toHaveProperty('projectId');
      expect(app).toHaveProperty('name');
      expect(app).toHaveProperty('ownerId', originalUserId);
    });
  });

  it('should return a project with projectId: ' + projectId, async () => {
    const result = await server.executeOperation({
      query: projectQuery,
      variables: {
        projectId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('project');
    expect(result.data?.project).toBeTruthy();
    expect(result.data?.project).toHaveProperty('projectId', projectId);
    expect(result.data?.project).toHaveProperty('name');
    expect(result.data?.project).toHaveProperty('ownerId');
  });

  it('should update the project description', async () => {
    const description = 'updated description';

    const result = await server.executeOperation({
      query: updateProjectMutation,
      variables: {
        projectId,
        project: {
          description,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('updateProject');
    expect(result.data?.updateProject).toBeTruthy();
    expect(result.data?.updateProject).toHaveProperty('projectId');
    expect(result.data?.updateProject).toHaveProperty('name');
    expect(result.data?.updateProject).toHaveProperty('description', description);
  });

  it('should find projects by a selector', async () => {
    const result = await server.executeOperation({
      query: findProjectsQuery,
      variables: {
        selectors: {
          name: projectName,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('findProjects');
    expect(Array.isArray(result.data?.findProjects)).toBe(true);
    expect(result.data?.findProjects.length).toEqual(1);
    expect(result.data?.findProjects[0]).toHaveProperty('projectId');
    expect(result.data?.findProjects[0]).toHaveProperty('name');
  });

  it('should delete the project', async () => {
    const result = await server.executeOperation({
      query: deleteProjectMutation,
      variables: {
        projectId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('deleteProject');
    expect(result.data?.deleteProject).toBeTruthy();
    expect(result.data?.deleteProject).toHaveProperty('projectId');
  } );

  it('should transfer the project ownership to different user', async () => {
    /* Create a new project as originalUser */
    const project1 = await server.executeOperation({
      query: createProjectMutation,
      variables: {
        project: {
          name: projectName,
          description: 'Lorem ipsum dolor sit amet',
        },
      },
    });
    /* Storing the projectId for other tests cases */
    const newProjectId = project1.data?.createProject.projectId;

    const result = await server.executeOperation({
      query: transferProjectOwnershipMutation,
      variables: {
        projectId: newProjectId,
        ownerId: newUserId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('transferProjectOwnership');
    expect(result.data?.transferProjectOwnership).toBeTruthy();
    expect(result.data?.transferProjectOwnership).toHaveProperty('projectId', newProjectId);
    expect(result.data?.transferProjectOwnership).toHaveProperty(
      'ownerId',
      newUserId
    );

    /* Check if the original user has edit permission */
    expect(result.data?.transferProjectOwnership.permissions[0]).toHaveProperty(
      'refId',
      originalUserId
    );
    expect(result.data?.transferProjectOwnership.permissions[0]).toHaveProperty(
      'role',
      Project.PermissionsRole.EDIT
    );
  });
});
