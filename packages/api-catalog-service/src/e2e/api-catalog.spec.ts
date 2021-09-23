/* Mock */
import mock from './mock.json';

import ApiCatalog from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
fragment namespaceType on NamespaceType {
  id
  createdOn
  createdBy
  updatedOn
  updatedBy
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
  name
  description
  category
  tags
  owners {
    email
    group
  }
  appUrl
}

query ListNamespaces {
  listNamespaces {
    ...namespaceType
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
`;

beforeAll( () => {
    request = supertest.agent( ApiCatalog );
} );
afterAll( done => ApiCatalog.close( done ) );

describe( 'API Catalog Microservice API Tests', () => {
    it( 'ListNamespaces should return all namespaces', done => {
        request
            .post( '/graphql' )
            .send( {
                query: query,
                operationName: 'ListNamespaces'
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );
                expect( res.body ).toHaveProperty( 'data.listNamespaces' );
            } )
            .end( ( err, res ) => {
                done( err );
            } );
    } );

    it( 'GetNamespaceById should return a single API namespace', done => {
        request
            .post( '/graphql' )
            .send( {
                query: query,
                operationName: 'GetNamespaceById',
                variables: {
                    id: mock.id
                }
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );
            } )
            .end( ( err, res ) => {
                done( err );
            } );
    } );

    it( 'CreateNamespace should create an API namespace', done => {
        request
            .post( '/graphql' )
            .send( {
                query: query,
                operationName: 'CreateNamespace',
                variables: {
                    payload: mock
                }
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );
                expect( res.body.data ).toHaveProperty( 'createNamespace' );
                expect( res.body.data.createNamespace ).toHaveProperty( 'id', mock.id );
                expect( res.body.data.createNamespace ).toHaveProperty( 'name', mock.name );
                expect( res.body.data.createNamespace ).toHaveProperty( 'description', mock.description );
            } )
            .end( ( err, res ) => {
                done( err );
            } );
    } );

    it( 'UpdateNamespace should update an API namespace', done => {
        request
            .post( '/graphql' )
            .send( {
                query: query,
                operationName: 'UpdateNamespace',
                variables: {
                    id: mock.id,
                    payload: mock
                }
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );
                expect( res.body.data ).toHaveProperty( 'updateNamespace' );
                expect( res.body.data.updateNamespace ).toHaveProperty( 'id', mock.id );
                expect( res.body.data.updateNamespace ).toHaveProperty( 'name', mock.name );
                expect( res.body.data.updateNamespace ).toHaveProperty( 'description', mock.description );
            } )
            .end( ( err, res ) => {
                done( err );
            } );
    } );

    it( 'DeleteNamespace should delete a namespace', done => {
        request
            .post( '/graphql' )
            .send( {
                query: query,
                operationName: 'DeleteNamespace',
                variables: {
                    id: mock.id
                }
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );

                expect( res.body.data ).toHaveProperty( 'deleteNamespace' );
            } )
            .end( ( err, res ) => {
                done( err );
            } );
    } );
} );
