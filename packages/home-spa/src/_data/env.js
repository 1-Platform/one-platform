const dotenv = require("dotenv-safe");
const pkg = require("../../package.json");
dotenv.config();

module.exports.API_URL = process.env.API_URL;
module.exports.KEYCLOAK_IDP_URL = process.env.KEYCLOAK_IDP_URL;
module.exports.KEYCLOAK_CLIENT_ID = process.env.KEYCLOAK_CLIENT_ID;
module.exports.KEYCLOAK_REALM = process.env.KEYCLOAK_REALM;
module.exports.OP_SUBSCRIPTIONS_URL = process.env.OP_SUBSCRIPTIONS_URL;
module.exports.SENTRY_DSN = process.env.SENTRY_DSN;
module.exports.environment = process.env.ELEVENTY_ENV || "development";
module.exports.version = pkg.version;
module.exports.MATOMO_URL = process.env.MATOMO_URL;
module.exports.MATOMO_SITE_ID = process.env.MATOMO_SITE_ID;
