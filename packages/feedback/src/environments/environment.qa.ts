// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=qa` then `environment.qa.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  name: 'qa',
  api: 'https://api.one-qa.cee.redhat.com',
  graphqlAPI: 'https://api.one-qa.cee.redhat.com/graphql',
  client: 'https://one-qa.cee.redhat.com',
  authIssuer: 'https://auth.stage.redhat.com/auth',
  matomoSiteID: 8, // Site ID from Piwik Analytics
  serviceNowURL: 'https://redhatqa.service-now.com',
  subscription: 'wss://api.one-qa.cee.redhat.com/subscriptions',
  authorization: 'Basic b25lX3BvcnRhbF9hcGk6PUw5dm5CK2RxNVoqcVo5cA=='
};
