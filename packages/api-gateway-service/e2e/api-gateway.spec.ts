/* Mock */
import ApiGateway from '../service';

/* Supertest */
import supertest from 'supertest';
// import * as async from 'async';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment userType on UserType {
      _id
      name
      uid
      name
      title
  }

  query ListUsers {
    listUsers {
        ...userType
    }
  }
`;

beforeAll( async () => {
  const promise = await new Promise( ( resolve, reject ) => {
    request = supertest.agent( ApiGateway );
    setTimeout( resolve, 100 );
  } );

  Promise.all( [ promise ] ).then( ( values ) => values );
} );
afterAll( done => {
  return ApiGateway.close( done );
} );

describe( 'API Gateway Test for Testing queries', () => {
  it( 'should list Users on API Gateway', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'ListUsers',
      } )
      .expect( res => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'listUsers' );
        expect( res.body.data.listUsers[ 0 ] ).toHaveProperty( '_id' );
        expect( res.body.data.listUsers[ 0 ] ).toHaveProperty( 'uid' );
        expect( res.body.data.listUsers[ 0 ] ).toHaveProperty( 'name' );
        expect( res.body.data.listUsers[ 0 ] ).toHaveProperty( 'title' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );
} );
