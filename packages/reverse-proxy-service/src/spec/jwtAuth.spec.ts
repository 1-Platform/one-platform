import { verifyJwtToken } from '../utils/verifyJwtToken';

describe( 'verifyJwtAuth util', () => {
  it( 'should return an error for invalid jwt token', (done) => {
    verifyJwtToken( 'invalidjwt', ( err: any, payload: any ) => {
      expect( err ).toBeDefined();
      done();
    } );
  } );
} );
