import supertest from 'supertest';
import mock from './mock';
import ApiCatalog from '../../service';

/* Supertest */

let request: supertest.SuperTest<supertest.Test>;
const query = `
fragment namespaceType on NamespaceType {
  id
  name
  slug
  description
  category
  tags
  owners {
    ... on OwnerMailingType {
      email
      group
    }
    ... on OwnerUserType {
      user {
        cn
        rhatJobTitle
      }
      group
    }
  }
  appUrl
  createdOn
  createdBy {
    cn
  }
  updatedOn
  updatedBy {
    cn
  }
  hash
  subscribers {
    email
    group
  }
  lastCheckedOn
  schemaEndpoint
  headers {
    key
    value
  }
  environments {
    name
    apiBasePath
  }
}

query ListNamespaces {
  listNamespaces {
    count
    data {
      ...namespaceType
    }
  }
}

query GetNamespaceById($id: ID!) {
  getNamespaceById(id: $id) {
    ...namespaceType
  }
}

mutation CreateNamespace($payload: NamespaceInput!) {
  createNamespace(payload: $payload) {
    ...namespaceType
  }
}

mutation UpdateNamespace($id: ID!, $payload: NamespaceInput!) {
  updateNamespace(id: $id, payload: $payload) {
    ...namespaceType
  }
}

mutation DeleteNamespace($id: ID!) {
  deleteNamespace(id: $id) {
    ...namespaceType
  }
}

mutation AddNamespaceSubscriber($id: ID!, $payload: ApiSubscriberInput!) {
  addNamespaceSubscriber(id: $id, payload: $payload) {
    id
    subscribers {
      group
      email
    }
  }
}

mutation RemoveNamespaceSubscriber($id: ID!, $payload: ApiSubscriberInput!) {
  removeNamespaceSubscriber(id: $id, payload: $payload) {
    id
    subscribers {
      group
      email
    }
  }
}
`;

beforeAll(() => {
  request = supertest.agent(ApiCatalog);
});
afterAll(() => ApiCatalog.close());

describe('API Catalog Microservice API Tests', () => {
  it('CreateNamespace should create an API namespace', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'CreateNamespace',
        variables: {
          payload: mock.namespaceMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createNamespace');
        expect(res.body.data.createNamespace).toHaveProperty('id', mock.namespaceMock.id);
        expect(res.body.data.createNamespace).toHaveProperty('name', mock.namespaceMock.name);
        expect(res.body.data.createNamespace).toHaveProperty('slug', mock.namespaceMock.slug);
        expect(res.body.data.createNamespace).toHaveProperty('description', mock.namespaceMock.description);
        expect(res.body.data.createNamespace).toHaveProperty('category', mock.namespaceMock.category);
        expect(res.body.data.createNamespace).toHaveProperty('tags', mock.namespaceMock.tags);
        expect(res.body.data.createNamespace).toHaveProperty('appUrl', mock.namespaceMock.appUrl);
        expect(res.body.data.createNamespace).toHaveProperty('schemaEndpoint', mock.namespaceMock.schemaEndpoint);
        expect(res.body.data.createNamespace).toHaveProperty('headers', mock.namespaceMock.headers);
        expect(res.body.data.createNamespace).toHaveProperty('environments', mock.namespaceMock.environments);
      })
      .end((err) => {
        done(err);
      });
  });

  it('ListNamespaces should return all namespaces', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListNamespaces',
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listNamespaces');
        expect(res.body.data.listNamespaces).toHaveProperty('count');
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('id', mock.namespaceMock.id);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('name', mock.namespaceMock.name);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('slug', mock.namespaceMock.slug);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('description', mock.namespaceMock.description);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('category', mock.namespaceMock.category);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('tags', mock.namespaceMock.tags);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('appUrl', mock.namespaceMock.appUrl);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('schemaEndpoint', mock.namespaceMock.schemaEndpoint);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('headers', mock.namespaceMock.headers);
        expect(res.body.data.listNamespaces.data[0]).toHaveProperty('environments', mock.namespaceMock.environments);
      })
      .end((err) => {
        done(err);
      });
  });

  it('GetNamespaceById should return a single API namespace', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'GetNamespaceById',
        variables: {
          id: mock.namespaceMock.id,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('getNamespaceById');
        expect(res.body.data.getNamespaceById).toHaveProperty('id', mock.namespaceMock.id);
        expect(res.body.data.getNamespaceById).toHaveProperty('name', mock.namespaceMock.name);
        expect(res.body.data.getNamespaceById).toHaveProperty('slug', mock.namespaceMock.slug);
        expect(res.body.data.getNamespaceById).toHaveProperty('description', mock.namespaceMock.description);
        expect(res.body.data.getNamespaceById).toHaveProperty('category', mock.namespaceMock.category);
        expect(res.body.data.getNamespaceById).toHaveProperty('tags', mock.namespaceMock.tags);
        expect(res.body.data.getNamespaceById).toHaveProperty('appUrl', mock.namespaceMock.appUrl);
        expect(res.body.data.getNamespaceById).toHaveProperty('schemaEndpoint', mock.namespaceMock.schemaEndpoint);
        expect(res.body.data.getNamespaceById).toHaveProperty('headers', mock.namespaceMock.headers);
        expect(res.body.data.getNamespaceById).toHaveProperty('environments', mock.namespaceMock.environments);
      })
      .end((err) => {
        done(err);
      });
  });

  it('UpdateNamespace should update an API namespace', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'UpdateNamespace',
        variables: {
          id: mock.namespaceMock.id,
          payload: mock.namespaceMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('updateNamespace');
        expect(res.body.data.updateNamespace).toHaveProperty('id', mock.namespaceMock.id);
        expect(res.body.data.updateNamespace).toHaveProperty('name', mock.namespaceMock.name);
        expect(res.body.data.updateNamespace).toHaveProperty('slug', mock.namespaceMock.slug);
        expect(res.body.data.updateNamespace).toHaveProperty('description', mock.namespaceMock.description);
        expect(res.body.data.updateNamespace).toHaveProperty('category', mock.namespaceMock.category);
        expect(res.body.data.updateNamespace).toHaveProperty('tags', mock.namespaceMock.tags);
        expect(res.body.data.updateNamespace).toHaveProperty('appUrl', mock.namespaceMock.appUrl);
        expect(res.body.data.updateNamespace).toHaveProperty('schemaEndpoint', mock.namespaceMock.schemaEndpoint);
        expect(res.body.data.updateNamespace).toHaveProperty('headers', mock.namespaceMock.headers);
        expect(res.body.data.updateNamespace).toHaveProperty('environments', mock.namespaceMock.environments);
      })
      .end((err) => {
        done(err);
      });
  });

  it('addNamespaceSubscriber should subscribe to an api', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'AddNamespaceSubscriber',
        variables: mock.subscriberMock,
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('addNamespaceSubscriber');
        expect(res.body.data.addNamespaceSubscriber).toHaveProperty('id', mock.subscriberMock.id);
        expect(res.body.data.addNamespaceSubscriber).toHaveProperty('subscribers');
      })
      .end((err) => {
        done(err);
      });
  });

  it('RemoveNamespaceSubscriber should un-subscribe to an api', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'RemoveNamespaceSubscriber',
        variables: mock.subscriberMock,
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('removeNamespaceSubscriber');
        expect(res.body.data.removeNamespaceSubscriber).toHaveProperty('id', mock.subscriberMock.id);
        expect(res.body.data.removeNamespaceSubscriber).toHaveProperty('subscribers');
      })
      .end((err) => {
        done(err);
      });
  });

  it('DeleteNamespace should delete a namespace', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'DeleteNamespace',
        variables: {
          id: mock.namespaceMock.id,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('deleteNamespace');
      })
      .end((err) => {
        done(err);
      });
  });
});
