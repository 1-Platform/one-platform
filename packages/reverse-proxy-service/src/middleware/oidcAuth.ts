import { auth } from 'express-openid-connect';
import { KEYCLOAK_CLIENT_ID, KEYCLOAK_ORIGINAL_HOST, KEYCLOAK_SECRET, KEYCLOAK_SERVER_URL } from '../config/env';

function oidcAuth () {
  return auth( {
    clientID: KEYCLOAK_CLIENT_ID,
    issuerBaseURL: KEYCLOAK_SERVER_URL,
    baseURL: KEYCLOAK_ORIGINAL_HOST,
    secret: KEYCLOAK_SECRET,
    authRequired: false,
  } );
}

export default oidcAuth;
