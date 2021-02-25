/**
 * Reexport the environment variables as JS constants for convenience
 *
 * Can also define default values for the variables as needed.
 *
 * i.e. export const VAR = process.env.VAR || 'default';
 *
 */

import dotenv from 'dotenv-safe';
dotenv.config( { path: '.env' } );

export const NODE_ENV = process.env.NODE_ENV || 'local';

export const PORT = process.env.PORT || 8080;

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/apps-service';
