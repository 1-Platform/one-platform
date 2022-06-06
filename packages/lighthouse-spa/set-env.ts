const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;
const sentryDSN = process.env.SENTRY_DSN && `'${process.env.SENTRY_DSN}'`;

const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   API_URL: '${process.env.API_URL}',
   WS_URL: '${process.env.WS_URL}',
   LH_SERVER_URL: '${process.env.LH_SERVER_URL}',
   LH_CONTACT_MAIL: '${process.env.LH_CONTACT_MAIL}',
   LH_DOC_URL: '${process.env.LH_DOC_URL}',
   OPCBASE_API_BASE_PATH: '${process.env.OPCBASE_API_BASE_PATH}',
   OPCBASE_SUBSCRIPTION_BASE_PATH: '${process.env.OPCBASE_SUBSCRIPTION_BASE_PATH}',
   OPCBASE_KEYCLOAK_URL: '${process.env.OPCBASE_KEYCLOAK_URL}',
   OPCBASE_KEYCLOAK_CLIENT_ID: '${process.env.OPCBASE_KEYCLOAK_CLIENT_ID}' ,
   OPCBASE_KEYCLOAK_REALM: '${process.env.OPCBASE_KEYCLOAK_REALM}',
   SENTRY_DSN: ${sentryDSN},
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${targetPath}`);
});
