const dotenv = require('dotenv-safe');
dotenv.config();

module.exports.API_URL = process.env.API_URL;
module.exports.KEYCLOAK_IDP_URL = process.env.KEYCLOAK_IDP_URL;
module.exports.KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
module.exports.KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
module.exports.OP_SUBSCRIPTIONS_URL = process.env.OP_SUBSCRIPTIONS_URL;
