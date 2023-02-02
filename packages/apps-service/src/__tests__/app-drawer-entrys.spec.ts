import { ApolloServer } from 'apollo-server-express';
import { schema } from '../app';
import { mongoose } from '../setup/database';
import {
  disconnectMockDatabase,
  setupMockDatabase,
} from './mocks/mockDatabase';
import {
  addAppDrawerEntry,
  app,
  apps,
  deleteAppDrawerEntry,
  setApplicationAuthentication,
  updateAppDrawerEntry,
} from './app-drawer-entrys-queries.gql';

let server: ApolloServer;
let projectName = 'Test Project 123';
let projectId = 'test-project-123';
let userId = 'some-user-id';
const appId = 'test-app-123',
  label = 'Test App',
  path = '/test';

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
  await mongoose.connection.db.collection('projects').insert({
    projectId,
    name: projectName,
    ownerId: userId,
    hosting: {
      applications: [
        {
          appId,
          name: label,
        },
      ],
    },
  });
});
afterAll(async () => {
  await mongoose.connection.db.collection('projects').deleteOne({
    projectId,
  });
  await disconnectMockDatabase();
});
beforeEach(() => {
  server = new ApolloServer({
    schema: schema,
    context: {
      userId,
    },
  });
});

describe('Application Drawer Entrys Queries and Mutations', () => {
  it('should create a new application entry', async () => {
    const result = await server.executeOperation({
      query: addAppDrawerEntry,
      variables: {
        projectId,
        appDrawerEntry: {
          appId,
          label,
          path,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('addAppDrawerEntry');
    expect(result.data?.addAppDrawerEntry).toBeTruthy();
    expect(result.data?.addAppDrawerEntry).toHaveProperty(
      'projectId',
      projectId
    );
    expect(result.data?.addAppDrawerEntry).toHaveProperty('appId', appId);
    expect(result.data?.addAppDrawerEntry).toHaveProperty('label', label);
    expect(result.data?.addAppDrawerEntry).toHaveProperty('path', path);
    expect(result.data?.addAppDrawerEntry).toHaveProperty(
      'authenticate',
      false
    );
  });

  it('should list all application drawer entries', async () => {
    const result = await server.executeOperation({
      query: apps,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('apps');
    expect(Array.isArray(result.data?.apps)).toBe(true);
    expect(result.data?.apps.length).toBeGreaterThanOrEqual(1);

    result.data?.apps.map((appDrawerEntry: ApplicationDrawerEntry) => {
      expect(appDrawerEntry).toHaveProperty('projectId');
      expect(appDrawerEntry).toHaveProperty('appId');
      expect(appDrawerEntry).toHaveProperty('label');
      expect(appDrawerEntry).toHaveProperty('path');
      expect(appDrawerEntry).toHaveProperty('authenticate');
    });
  });

  it(
    'should return an application drawer entry with appId:' + appId,
    async () => {
      const result = await server.executeOperation({
        query: app,
        variables: {
          appId,
        },
      });

      expect(result.errors).toBeUndefined();
      expect(result.data).toBeTruthy();
      expect(result.data).toHaveProperty('app');
      expect(result.data?.app).toBeTruthy();
      expect(result.data?.app).toHaveProperty('projectId', projectId);
      expect(result.data?.app).toHaveProperty('appId', appId);
      expect(result.data?.app).toHaveProperty('label', label);
      expect(result.data?.app).toHaveProperty('path', path);
      expect(result.data?.app).toHaveProperty('authenticate', false);
    }
  );

  it('should update the app path', async () => {
    const newPath = '/test-123';

    const result = await server.executeOperation({
      query: updateAppDrawerEntry,
      variables: {
        projectId,
        appId,
        appDrawerEntry: {
          path: newPath,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('updateAppDrawerEntry');
    expect(result.data?.updateAppDrawerEntry).toBeTruthy();
    expect(result.data?.updateAppDrawerEntry).toHaveProperty(
      'projectId',
      projectId
    );
    expect(result.data?.updateAppDrawerEntry).toHaveProperty('appId', appId);
    expect(result.data?.updateAppDrawerEntry).toHaveProperty('label', label);
    expect(result.data?.updateAppDrawerEntry).toHaveProperty('path', newPath);
  });

  it('should set authenticate to true', async () => {
    const result = await server.executeOperation({
      query: setApplicationAuthentication,
      variables: {
        projectId,
        appId,
        value: true,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('setApplicationAuthentication');
    expect(result.data?.setApplicationAuthentication).toBeTruthy();
    expect(result.data?.setApplicationAuthentication).toHaveProperty(
      'projectId',
      projectId
    );
    expect(result.data?.setApplicationAuthentication).toHaveProperty(
      'appId',
      appId
    );
    expect(result.data?.setApplicationAuthentication).toHaveProperty(
      'authenticate',
      true
    );
  });

  it('should delete the app drawer entry', async () => {
    const result = await server.executeOperation({
      query: deleteAppDrawerEntry,
      variables: {
        projectId,
        appId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('deleteAppDrawerEntry');
    expect(result.data?.deleteAppDrawerEntry).toBeTruthy();
    expect(result.data?.deleteAppDrawerEntry).toHaveProperty(
      'projectId',
      projectId
    );
    expect(result.data?.deleteAppDrawerEntry).toHaveProperty('appId', appId);
    expect(result.data?.deleteAppDrawerEntry).toHaveProperty('label', label);
  });
});
