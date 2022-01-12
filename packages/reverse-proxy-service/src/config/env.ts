import { config } from 'dotenv-safe';
config( { path: '.env' } );

/* Exporting environment variables as JS Constants */
export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PORT = process.env.PORT || 8080;

export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'topsecretcookie';    // lgtm[js/hardcoded-credentials]

/* Keycloak environment variables */
export const { KEYCLOAK_PUBKEY, KEYCLOAK_CLIENT_ID, KEYCLOAK_SERVER_URL, KEYCLOAK_REALM, KEYCLOAK_ORIGINAL_HOST } = process.env;

/* CouchDB environment variables */
export const { COUCHDB_HOST, COUCHDB_SECRET } = process.env;

/* SPASHIP environment variables */
export const { SPASHIP_ROUTER_HOST } = process.env;
