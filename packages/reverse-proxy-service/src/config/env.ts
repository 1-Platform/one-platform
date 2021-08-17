import { config } from 'dotenv-safe';
config( { path: '.env' } );

/* Exporting environment variables as JS Constants */

export const PORT = process.env.PORT || 8080;

/* Keycloak public key */
export const { KEYCLOAK_PUBKEY } = process.env;

/* CouchDB environment variables */
export const { COUCHDB_HOST, COUCHDB_SECRET } = process.env;
