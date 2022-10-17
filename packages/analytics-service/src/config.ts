import dotenv from 'dotenv-safe';

type Config = {
  port: number;
  env: 'development' | 'production' | 'test';
  mongoURI: string;
  redisURI?: string;
  apiGatewayURL: string;
  apiGatewayToken: string;
  sentryAPIToken: string;
  sentryAPIURL: string;
  sentryOrgName: string;
  sentryTeamName: string;
  matomoAPIURL: string;
  matomoAPIToken: string;
};

export const setupConfig = (): Config => {
  if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.test.env' });
  } else {
    dotenv.config({ path: '.env' });
  }

  return {
    port: Number(process.env.PORT || 8080),
    env: (process.env.NODE_ENV || 'development') as Config['env'],
    mongoURI: process.env.MONGO_URI || '',
    redisURI: process.env.REDIS_URI,
    apiGatewayURL: process.env.API_GATEWAY_URL || '',
    apiGatewayToken: process.env.API_GATEWAY_TOKEN || '',
    sentryAPIToken: process.env.SENTRY_API_TOKEN || '',
    sentryAPIURL: process.env.SENTRY_API_URL || 'https://sentry.io',
    sentryOrgName: process.env.SENTRY_API_ORG || '',
    sentryTeamName: process.env.SENTRY_API_TEAM || 'one-platform',
    matomoAPIToken: process.env.MATOMO_API_TOKEN || '',
    matomoAPIURL: process.env.MATOMO_API_URL || '',
  };
};
