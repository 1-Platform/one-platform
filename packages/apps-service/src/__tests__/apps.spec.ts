import { ApolloServer } from 'apollo-server-express';
import { schema } from '../app';
import {
  disconnectMockDatabase,
  setupMockDatabase,
} from './mocks/mockDatabase';
import {
  appByAppIdQuery,
  appByIdQuery,
  appsQuery,
  createAppMutation,
  deleteAppMutation,
  findAppsQuery,
  myAppsQuery,
  transferAppOwnershipMutation,
  updateAppMutation,
} from './query.gql';

let server: ApolloServer;
let appName = 'Test-App-' + Math.round(Math.random() * 50);
let id = '';
let appId = '';
let userId = 'some-user-id';

jest.mock('../utils/apps-helper', () => ({
  manageSearchIndex: jest.fn(),
  formatSearchInput: jest.fn(),
}));
jest.mock('../services/user-group', () => ({
  getUser: jest.fn(() => () => ({
    rhatUUID: 'new-user-id'
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
      rhatUUID: userId,
    },
  });
});

describe('Apps Queries and Mutations Test', () => {
  it('should create a new app', async () => {
    const result = await server.executeOperation({
      query: createAppMutation,
      variables: {
        app: {
          name: appName,
          description: 'Lorem ipsum dolor sit amet',
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toBeTruthy();
    expect(result.data).toHaveProperty('createApp');
    expect(result.data?.createApp).toBeTruthy();
    expect(result.data?.createApp).toHaveProperty('id');
    expect(result.data?.createApp).toHaveProperty('appId');
    expect(result.data?.createApp).toHaveProperty('name', appName);
    expect(result.data?.createApp).toHaveProperty('path');
    expect(result.data?.createApp).toHaveProperty('isActive');
    expect(result.data?.createApp).toHaveProperty('ownerId', userId);
    expect(result.data?.createApp).toHaveProperty('createdBy', userId);
    expect(result.data?.createApp).toHaveProperty('createdOn');
    expect(Date.parse(result.data?.createApp.createdOn)).not.toBeNaN();

    /* Storing the id and appId for other tests cases */
    id = result.data?.createApp.id;
    appId = result.data?.createApp.appId;
  });

  it('should list all Apps', async () => {
    const result = await server.executeOperation({
      query: appsQuery,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('apps');
    expect(Array.isArray(result.data?.apps)).toBe(true);
    expect(result.data?.apps.length).toBeGreaterThanOrEqual(1);

    result.data?.apps.map((app: any) => {
      expect(app).toHaveProperty('id');
      expect(app).toHaveProperty('appId');
      expect(app).toHaveProperty('name');
    });
  });

  it('should list the apps of the user: ' + userId, async () => {
    const result = await server.executeOperation({
      query: myAppsQuery,
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('myApps');
    expect(Array.isArray(result.data?.myApps)).toBe(true);
    expect(result.data?.myApps.length).toBeGreaterThanOrEqual(1);

    result.data?.myApps.map((app: any) => {
      expect(app).toHaveProperty('id');
      expect(app).toHaveProperty('appId');
      expect(app).toHaveProperty('name');
      expect(app).toHaveProperty('ownerId', userId);
    });
  });

  it('should return an app with id', async () => {
    const result = await server.executeOperation({
      query: appByIdQuery,
      variables: {
        id,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('app');
    expect(result.data?.app).toBeTruthy();
    expect(result.data?.app).toHaveProperty('id', id);
    expect(result.data?.app).toHaveProperty('appId');
    expect(result.data?.app).toHaveProperty('name');
  });

  it('should return an app with appId: ' + appId, async () => {
    const result = await server.executeOperation({
      query: appByAppIdQuery,
      variables: {
        appId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('app');
    expect(result.data?.app).toBeTruthy();
    expect(result.data?.app).toHaveProperty('id');
    expect(result.data?.app).toHaveProperty('appId', appId);
    expect(result.data?.app).toHaveProperty('name');
  });

  it('should update the app description', async () => {
    const path = '/' + appName.toLocaleLowerCase();
    const description = 'updated description';

    const result = await server.executeOperation({
      query: updateAppMutation,
      variables: {
        id,
        app: {
          path,
          description,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('updateApp');
    expect(result.data?.updateApp).toBeTruthy();
    expect(result.data?.updateApp).toHaveProperty('id', id);
    expect(result.data?.updateApp).toHaveProperty('appId');
    expect(result.data?.updateApp).toHaveProperty('name');
    expect(result.data?.updateApp).toHaveProperty('path', path);
    expect(result.data?.updateApp).toHaveProperty('description', description);
  });

  it('should find apps by a selector', async () => {
    const result = await server.executeOperation({
      query: findAppsQuery,
      variables: {
        selectors: {
          name: appName,
        },
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('findApps');
    expect(Array.isArray(result.data?.findApps)).toBe(true);
    expect(result.data?.findApps.length).toEqual(1);
    expect(result.data?.findApps[0]).toHaveProperty('id');
    expect(result.data?.findApps[0]).toHaveProperty('appId');
    expect(result.data?.findApps[0]).toHaveProperty('name');
    expect(result.data?.findApps[0]).toHaveProperty('path');
  });

  it('should transfer the ownership to different user', async () => {
    userId = 'new-user-id';

    const result = await server.executeOperation({
      query: transferAppOwnershipMutation,
      variables: {
        id,
        ownerId: userId,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('transferAppOwnership');
    expect(result.data?.transferAppOwnership).toBeTruthy();
    expect(result.data?.transferAppOwnership).toHaveProperty('id', id);
    expect(result.data?.transferAppOwnership).toHaveProperty('appId');
    expect(result.data?.transferAppOwnership).toHaveProperty('ownerId', userId);
  });

  it('should delete the app', async () => {
    const result = await server.executeOperation({
      query: deleteAppMutation,
      variables: {
        id,
      },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data).toHaveProperty('deleteApp');
    expect(result.data?.deleteApp).toBeTruthy();
    expect(result.data?.deleteApp).toHaveProperty('id', id);
    expect(result.data?.deleteApp).toHaveProperty('appId');
  });
});
