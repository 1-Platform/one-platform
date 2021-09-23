/**
 * Reexport the environment variables as JS constants for convenience
 *
 * Can also define default values for the variables as needed.
 *
 * i.e. export const VAR = process.env.VAR || 'default';
 *
 */

import { config } from 'dotenv-safe';
if ( process.env.NODE_ENV === 'test' ) {
  config( { path: '.test.env' } );
} else {
  config( { path: '.env' } );
}


export const NODE_ENV = process.env.NODE_ENV ?? 'local';
export const PORT = process.env.PORT ?? 8080;

export const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://mongo:27017/search-service';

/* One Platform API Gateway */
export const API_GATEWAY = process.env.API_GATEWAY ?? '';
export const GATEWAY_AUTH_TOKEN = process.env.GATEWAY_AUTH_TOKEN ?? '';
export const CLIENT_URL = process.env.CLIENT_URL ?? '';

/* Hydra and Search APIs */
export const HYDRA_API = process.env.HYDRA_API ?? '';
export const SEARCH_API = process.env.SEARCH_API ?? '';
export const ENABLE_HYDRA_PROXY = process.env.ENABLE_HYDRA_PROXY ?? '';
export const AKAMAI_API = process.env.AKAMAI_API ?? '';

/* Search Indexing Datasource */
export const SEARCH_DATA_SOURCE = process.env.SEARCH_DATA_SOURCE ?? '';

/* External SSO */
export const SSO_URL = process.env.SSO_URL ?? '';
export const CLIENT_ID = process.env.CLIENT_ID ?? '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET ?? '';
