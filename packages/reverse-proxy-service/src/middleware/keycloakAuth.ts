import { NextFunction, Request, Response } from 'express';
import { Keycloak } from 'keycloak-connect';
import { v4 as uuidV4 } from 'uuid';
import { KEYCLOAK_ORIGINAL_HOST } from '../config/env';
import keycloak from '../utils/keycloakAuth';

function keycloakAuth ( req: Request & { kauth?: any; }, res: Response, next: NextFunction ) {
  if ( req.kauth && req.kauth.grant ) {
    return next();
  }

  forceLogin( keycloak, req, res );
}
export default keycloakAuth;

function forceLogin ( keycloak: Keycloak, req: Request, res: Response ) {
  const host = KEYCLOAK_ORIGINAL_HOST ?? req.hostname;
  const headerHost = req.headers.host?.split( ':' ) ?? [];
  const port = KEYCLOAK_ORIGINAL_HOST ? false : headerHost[ 1 ];
  const protocol = req.protocol;
  const redirectPath = req.originalUrl ?? req.url;
  const hasQuery = ~redirectPath.indexOf( '?' );

  const redirectUrl = `${ protocol }://${ host }${ !port ? '' : ':' + port }${ redirectPath }${ hasQuery ? '&' : '?' }auth_callback=1`;

  if ( req.session ) {
    ( req.session as any ).auth_redirect_uri = redirectUrl;
  }

  const uuid = uuidV4();
  const loginUrl = keycloak.loginUrl( uuid, redirectUrl );
  res.redirect( loginUrl );
}
