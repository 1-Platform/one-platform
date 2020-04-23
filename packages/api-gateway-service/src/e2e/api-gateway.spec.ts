import dotenv from 'dotenv';
/* Mock */
import ApiGateway from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment userType on UserType {
      _id
  }

  query ListUsers {
    listUsers {
        ...userType
    }
  }
`;

beforeAll( () => {
  request = supertest.agent( ApiGateway );
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
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );
} );
