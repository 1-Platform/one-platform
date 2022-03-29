import { NextFunction, Request, Response } from 'express';
import request from 'supertest';
import app from '../app';

function oidcMiddlewareMock () {
  return ( req: Request, res: Response, next: NextFunction ) => {
    res.redirect( '/authenticate' );
  };
};
jest.mock( '../middleware/oidcAuth', () => oidcMiddlewareMock );

describe( 'Restricted SPAs - OIDC Auth middleware', () => {
  it( '/rhel-developer-guide - should redirect for authentication with 302', ( done ) => {
    request( app )
      .get( '/rhel-developer-guide' )
      .expect( 302 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        expect( res.header?.location.includes('/authenticate') ).toBe(true);
        done();
      } );
  } );

  it( '/rhel-development-guide - should redirect for authentication with 302', ( done ) => {
    request( app )
      .get( '/rhel-development-guide' )
      .expect( 302 )
      .end( ( err, res ) => {
        if ( err ) {
          return done( err );
        }
        expect( res.header?.location.includes('/authenticate') ).toBe(true);
        done();
      } );
  } );
} );
