import dotenv from 'dotenv-safe';

export type Config = {
  port: number;
  env: 'development' | 'production' | 'test';
  smtpHost: string;
  mongoURI: string;
  redisURI?: string;
  apiGatewayURL: string;
  apiGatewayToken: string;
  nsEncryptionKey: string;
  outageStatusURL: string;
  rhatServiceNowURL: string;
  rhatServieNowUsername: string;
  rhatServieNowPassword: string;
};

export const setupConfig = (): Config => {
  const env = (process.env.NODE_ENV || 'development') as Config['env'];

  if (env === 'test') {
    dotenv.config({ path: '.test.env' });
  } else {
    dotenv.config();
  }

  const nsEncryptionKey = process.env.NAMESPACE_ENCRYPTION_KEY;
  if (nsEncryptionKey) {
    if (Buffer.byteLength(Buffer.from(nsEncryptionKey, 'hex'), 'utf-8') !== 32) {
      throw Error('Namespace encryption key must  be 256 bits or 32 characters');
    }
  }

  return {
    port: Number(process.env.PORT || 8080),
    smtpHost: process.env.SMTP_HOST || '',
    env,
    nsEncryptionKey: nsEncryptionKey as string,
    mongoURI: process.env.MONGO_URI || '',
    redisURI: process.env.REDIS_URI,
    apiGatewayURL: process.env.API_GATEWAY_URL || '',
    apiGatewayToken: process.env.API_GATEWAY_TOKEN || '',
    outageStatusURL: process.env.OUTAGE_STATUS_URL || '',
    rhatServiceNowURL: process.env.RHAT_SERVICE_NOW_URL || '',
    rhatServieNowUsername: process.env.RHAT_SERVICE_NOW_USERNAME || '',
    rhatServieNowPassword: process.env.RHAT_SERVICE_NOW_PASSWORD || '',
  };
};
