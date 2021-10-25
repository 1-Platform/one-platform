export const NODE_ENV = process.env.NODE_ENV || 'local';

export const PORT = process.env.PORT || 8080;

export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/api-catalog';

export const API_GATEWAY = process.env.API_GATEWAY || 'http://localhost:8080/graphql';

export const { GATEWAY_AUTH_TOKEN } = process.env;

export const { SPA_URL } = process.env;

export const { SMTP_HOST } = process.env;
