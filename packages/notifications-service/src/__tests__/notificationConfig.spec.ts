/* Mock */
import mock from '../__mocks__/mockData.json';

import Notifications from '../../service';
jest.mock( '../helpers' );

/* Supertest */
import supertest from 'supertest';

let mockID = '';
let request: supertest.SuperTest<supertest.Test>;
const query = /* GraphQL */`
  fragment notificationConfigType on NotificationConfigType {
    id
    template
    channel
    type
    target
  }

  query List {
    listNotificationConfigs {
      ...notificationConfigType
    }
  }
  query Get($input: NotificationConfigInput!) {
    getNotificationConfigsBy(notificationConfig: $input) {
      ...notificationConfigType
    }
  }
  mutation Create($input: NotificationConfigInput!) {
    createNotificationConfig(notificationConfig: $input) {
      ...notificationConfigType
    }
  }
  mutation Update($input: NotificationConfigInput!) {
    updateNotificationConfig(notificationConfig: $input) {
      ...notificationConfigType
    }
  }
  mutation Delete($id: String!) {
    deleteNotificationConfig(id: $id) {
      ...notificationConfigType
    }
  }
`;

beforeAll( () => {
  request = supertest.agent( Notifications );
} );
afterAll( done => {
  Notifications.close( done );
} );

describe( 'NotificationConfig', () => {
  it( 'should create a document', done => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'Create',
        variables: {
          input: mock
        }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'createNotificationConfig' );
        expect( res.body.data.createNotificationConfig ).toMatchObject( mock );
        mockID = res.body.data.createNotificationConfig.id;
      } )
      .end( done );
  } );

  it( 'should return all documents', done => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'List'
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'listNotificationConfigs' );
        expect( Array.isArray( res.body.data.listNotificationConfigs ) ).toBeTruthy();
      } )
      .end( done );
  } );

  it( 'should return a single matched document', done => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'Get',
        variables: { input: { type: 'trigger-based' } }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'getNotificationConfigsBy' );
        expect( Array.isArray( res.body.data.getNotificationConfigsBy ) ).toBe( true );
        expect( res.body.data.getNotificationConfigsBy.length ).toBeGreaterThan( 0 );
        expect( res.body.data.getNotificationConfigsBy[ 0 ] ).toMatchObject( mock );
      } )
      .end( done );
  } );

  it( 'should update a document', done => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'Update',
        variables: {
          input: {
            id: mockID,
            ...mock,
            target: 'one-portal-devel2'
          }
        }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'updateNotificationConfig' );
        expect( res.body.data.updateNotificationConfig ).toMatchObject( {
          ...mock,
          target: 'one-portal-devel2'
        } );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'should delete a document', done => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'Delete',
        variables: { id: mockID }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'deleteNotificationConfig' );
        expect( res.body.data.deleteNotificationConfig ).toMatchObject( {
          ...mock,
          target: 'one-portal-devel2'
        } );
      } )
      .end( done );
  } );
} );
