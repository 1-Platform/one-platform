/* Mock */
import mock from './mock.json';

import ApiCatalog from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
fragment namespaceType on NamespaceType {
  _id
  createdOn
  createdBy
  updatedOn
  updatedBy
  environments {
    hash
    subscribers {
      email
      group
    }
    lastCheckedOn
    name
    schemaEndpoint
    apiBasePath
    headers {
      key
      value
    }
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

query GetNamespaceById($_id: ID!) {
  getNamespaceById(_id: $_id) {
    ...namespaceType
  }
}

mutation CreateNamespace($payload: NamespaceInput!) {
    createNamespace(payload:$payload) {
        ...namespaceType
    }
}

mutation UpdateNamespace($_id: ID!, $payload: NamespaceInput!) {
    updateNamespace(_id:$_id, payload:$payload) {
        ...namespaceType
    }
}

mutation DeleteNamespace($_id: ID!) {
    deleteNamespace(_id:$_id) {
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
                    _id: mock._id
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
                expect( res.body.data.createNamespace ).toHaveProperty( '_id', mock._id );
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
                    _id: mock._id,
                    payload: mock
                }
            } )
            .expect( res => {
                expect( res.body ).not.toHaveProperty( 'errors' );
                expect( res.body ).toHaveProperty( 'data' );
                expect( res.body.data ).toHaveProperty( 'updateNamespace' );
                expect( res.body.data.updateNamespace ).toHaveProperty( '_id', mock._id );
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
                    _id: mock._id
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
