/* Mock */
import mock from '../__mocks__/mockData.json';

import Notifications from '../../service';
jest.mock( '../helpers' );

/* Supertest */
import supertest from 'supertest';

let mockID = '';
let request: supertest.SuperTest<supertest.Test>;
const query = /* GraphQL */`
  fragment notificationConfig on NotificationConfig {
    id
    template
    channel
    type
    targets
    createdBy
  }
  fragment notificationConfigRaw on NotificationConfigRaw {
    id
    template
    channel
    type
    targets
    createdBy
  }

  query List {
    listNotificationConfigs {
      ...notificationConfig
    }
  }
  query Get($input: NotificationConfigInput!) {
    getNotificationConfigsBy(selectors: $input) {
      ...notificationConfig
    }
  }
  mutation Create($input: NotificationConfigInput!) {
    createNotificationConfig(notificationConfig: $input) {
      ...notificationConfigRaw
    }
  }
  mutation Update($input: NotificationConfigInput!) {
    updateNotificationConfig(notificationConfig: $input) {
      ...notificationConfigRaw
    }
  }
  mutation Delete($id: String!) {
    deleteNotificationConfig(id: $id) {
      ...notificationConfigRaw
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
        expect( res.body.data.createNotificationConfig ).toMatchObject( {
          channel: mock.channel,
          type: mock.type,
          targets: mock.targets,
        } );
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
        variables: { input: { type: mock.type } }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'getNotificationConfigsBy' );
        expect( Array.isArray( res.body.data.getNotificationConfigsBy ) ).toBe( true );
        expect( res.body.data.getNotificationConfigsBy.length ).toBeGreaterThan( 0 );
        expect( res.body.data.getNotificationConfigsBy[ 0 ] ).toMatchObject( {
          channel: mock.channel,
          type: mock.type,
          targets: mock.targets,
        } );
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
            targets: [ 'one-portal-devel2' ]
          }
        }
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'updateNotificationConfig' );
        expect( res.body.data.updateNotificationConfig ).toMatchObject( {
          id: mockID,
          channel: mock.channel,
          type: mock.type,
          targets: [ 'one-portal-devel2' ]
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
          targets: [ 'one-portal-devel2' ]
        } );
      } )
      .end( done );
  } );
} );
