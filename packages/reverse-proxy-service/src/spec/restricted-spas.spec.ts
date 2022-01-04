import request from 'supertest';
import app from '../app';
import { KEYCLOAK_SERVER_URL } from '../config/env';

describe( '/rhel-developer-guide - Keycloak Auth middleware', () => {
  it( 'should redirect for authentication with 302', ( done ) => {
    request( app )
      .get( '/rhel-developer-guide' )
      .expect( 302 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        expect( res.header?.location.includes(KEYCLOAK_SERVER_URL) ).toBe(true);
        done();
      } );
  } );
} );
