import request from 'supertest';
import app from '../app';

describe( '/api - Reverse Proxy Entrypoint', () => {
  it( 'should show a welcome message', (done) => {
    request( app )
      .get( '/api' )
      .expect( 200 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        expect( res.body ).toMatchObject( { message: 'This is a proxy service.' } );
        done();
      } );
  } );
} );
