import request from 'supertest';
import app from '../app';

describe( '/api/couchdb - CouchDB API middleware', () => {
  it( 'should return 403', (done) => {
    request( app )
      .get( '/api/couchdb' )
      .expect( 403 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        expect( res.body ).toMatchObject( { error: 'Request is not authenticated' } );
        done();
      });
  } );
} );
