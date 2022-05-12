// import supertest from 'supertest';
// import ApiCatalog from '../service';
// import { namespaceMock, subscriberMock } from './mock';

// /* Supertest */

// let request: supertest.SuperTest<supertest.Test>;
// const query = `
// fragment namespaceType on NamespaceType {
//   id
//   name
//   slug
//   description
//   category
//   tags
//   owners {
//     ... on OwnerMailingType {
//       email
//       group
//     }
//     ... on OwnerUserType {
//       user {
//         cn
//         rhatJobTitle
//       }
//       group
//     }
//   }
//   appUrl
//   createdOn
//   createdBy {
//     cn
//   }
//   updatedOn
//   updatedBy {
//     cn
//   }
//   hash
//   subscribers {
//     email
//     group
//   }
//   lastCheckedOn
//   schemaEndpoint
//   headers {
//     key
//     value
//   }
//   environments {
//     name
//     apiBasePath
//   }
// }

// query ListNamespaces {
//   listNamespaces {
//     count
//     data {
//       ...namespaceType
//     }
//   }
// }

// query GetNamespaceById($id: ID!) {
//   getNamespaceById(id: $id) {
//     ...namespaceType
//   }
// }

// mutation CreateNamespace($payload: NamespaceInput!) {
//   createNamespace(payload: $payload) {
//     ...namespaceType
//   }
// }

// mutation UpdateNamespace($id: ID!, $payload: NamespaceInput!) {
//   updateNamespace(id: $id, payload: $payload) {
//     ...namespaceType
//   }
// }

// mutation DeleteNamespace($id: ID!) {
//   deleteNamespace(id: $id) {
//     ...namespaceType
//   }
// }

// mutation AddNamespaceSubscriber($id: ID!, $payload: ApiSubscriberInput!) {
//   addNamespaceSubscriber(id: $id, payload: $payload) {
//     id
//     subscribers {
//       group
//       email
//     }
//   }
// }

// mutation RemoveNamespaceSubscriber($id: ID!, $payload: ApiSubscriberInput!) {
//   removeNamespaceSubscriber(id: $id, payload: $payload) {
//     id
//     subscribers {
//       group
//       email
//     }
//   }
// }
// `;

// beforeAll(() => {
//   request = supertest.agent(ApiCatalog);
// });
// afterAll(() => ApiCatalog.close());

// describe('API Catalog Microservice API Tests', () => {
//   it('CreateNamespace should create an API namespace', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'CreateNamespace',
//         variables: {
//           payload: namespaceMock,
//         },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('createNamespace');
//         expect(res.body.data.createNamespace).toHaveProperty('id', namespaceMock.id);
//         expect(res.body.data.createNamespace).toHaveProperty('name', namespaceMock.name);
//         expect(res.body.data.createNamespace).toHaveProperty('slug', namespaceMock.slug);
//         expect(res.body.data.createNamespace).toHaveProperty(
//           'description',
//           namespaceMock.description,
//         );
//         expect(res.body.data.createNamespace).toHaveProperty('category', namespaceMock.category);
//         expect(res.body.data.createNamespace).toHaveProperty('tags', namespaceMock.tags);
//         expect(res.body.data.createNamespace).toHaveProperty('appUrl', namespaceMock.appUrl);
//         expect(res.body.data.createNamespace).toHaveProperty(
//           'schemaEndpoint',
//           namespaceMock.schemaEndpoint,
//         );
//         expect(res.body.data.createNamespace).toHaveProperty('headers', namespaceMock.headers);
//         expect(res.body.data.createNamespace).toHaveProperty(
//           'environments',
//           namespaceMock.environments,
//         );
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('ListNamespaces should return all namespaces', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'ListNamespaces',
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('listNamespaces');
//         expect(res.body.data.listNamespaces).toHaveProperty('count');
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty('id', namespaceMock.id);
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty('name', namespaceMock.name);
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty('slug', namespaceMock.slug);
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty(
//           'description',
//           namespaceMock.description,
//         );
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty(
//           'category',
//           namespaceMock.category,
//         );
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty('tags', namespaceMock.tags);
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty('appUrl', namespaceMock.appUrl);
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty(
//           'schemaEndpoint',
//           namespaceMock.schemaEndpoint,
//         );
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty(
//           'headers',
//           namespaceMock.headers,
//         );
//         expect(res.body.data.listNamespaces.data[0]).toHaveProperty(
//           'environments',
//           namespaceMock.environments,
//         );
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('GetNamespaceById should return a single API namespace', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'GetNamespaceById',
//         variables: {
//           id: namespaceMock.id,
//         },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('getNamespaceById');
//         expect(res.body.data.getNamespaceById).toHaveProperty('id', namespaceMock.id);
//         expect(res.body.data.getNamespaceById).toHaveProperty('name', namespaceMock.name);
//         expect(res.body.data.getNamespaceById).toHaveProperty('slug', namespaceMock.slug);
//         expect(res.body.data.getNamespaceById).toHaveProperty(
//           'description',
//           namespaceMock.description,
//         );
//         expect(res.body.data.getNamespaceById).toHaveProperty('category', namespaceMock.category);
//         expect(res.body.data.getNamespaceById).toHaveProperty('tags', namespaceMock.tags);
//         expect(res.body.data.getNamespaceById).toHaveProperty('appUrl', namespaceMock.appUrl);
//         expect(res.body.data.getNamespaceById).toHaveProperty(
//           'schemaEndpoint',
//           namespaceMock.schemaEndpoint,
//         );
//         expect(res.body.data.getNamespaceById).toHaveProperty('headers', namespaceMock.headers);
//         expect(res.body.data.getNamespaceById).toHaveProperty(
//           'environments',
//           namespaceMock.environments,
//         );
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('UpdateNamespace should update an API namespace', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'UpdateNamespace',
//         variables: {
//           id: namespaceMock.id,
//           payload: namespaceMock,
//         },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('updateNamespace');
//         expect(res.body.data.updateNamespace).toHaveProperty('id', namespaceMock.id);
//         expect(res.body.data.updateNamespace).toHaveProperty('name', namespaceMock.name);
//         expect(res.body.data.updateNamespace).toHaveProperty('slug', namespaceMock.slug);
//         expect(res.body.data.updateNamespace).toHaveProperty(
//           'description',
//           namespaceMock.description,
//         );
//         expect(res.body.data.updateNamespace).toHaveProperty('category', namespaceMock.category);
//         expect(res.body.data.updateNamespace).toHaveProperty('tags', namespaceMock.tags);
//         expect(res.body.data.updateNamespace).toHaveProperty('appUrl', namespaceMock.appUrl);
//         expect(res.body.data.updateNamespace).toHaveProperty(
//           'schemaEndpoint',
//           namespaceMock.schemaEndpoint,
//         );
//         expect(res.body.data.updateNamespace).toHaveProperty('headers', namespaceMock.headers);
//         expect(res.body.data.updateNamespace).toHaveProperty(
//           'environments',
//           namespaceMock.environments,
//         );
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('addNamespaceSubscriber should subscribe to an api', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'AddNamespaceSubscriber',
//         variables: subscriberMock,
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('addNamespaceSubscriber');
//         expect(res.body.data.addNamespaceSubscriber).toHaveProperty('id', subscriberMock.id);
//         expect(res.body.data.addNamespaceSubscriber).toHaveProperty('subscribers');
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('RemoveNamespaceSubscriber should un-subscribe to an api', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'RemoveNamespaceSubscriber',
//         variables: subscriberMock,
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('removeNamespaceSubscriber');
//         expect(res.body.data.removeNamespaceSubscriber).toHaveProperty('id', subscriberMock.id);
//         expect(res.body.data.removeNamespaceSubscriber).toHaveProperty('subscribers');
//       })
//       .end((err) => {
//         done(err);
//       });
//   });

//   it('DeleteNamespace should delete a namespace', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'DeleteNamespace',
//         variables: {
//           id: namespaceMock.id,
//         },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');

//         expect(res.body.data).toHaveProperty('deleteNamespace');
//       })
//       .end((err) => {
//         done(err);
//       });
//   });
// });
