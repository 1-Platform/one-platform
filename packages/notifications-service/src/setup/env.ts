import { config } from 'dotenv-safe';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.test.env' });
} else {
  config();
}

export const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const PORT = parseInt(process.env.PORT ?? '8080', 10);

/* MongoDB conneciton details */
export const MONGO_URL =
  process.env.MONGO_URL ?? 'mongodb://localhost:27017/notifications';

/* Redis Connection details */
export const REDIS_HOST = process.env.REDIS_HOST ?? 'localhost';
export const REDIS_PORT = parseInt(process.env.REDIS_PORT ?? '6379', 10);

/* Notification Settings */
export const DISABLE_PUSH_NOTIFICATIONS = process.env.DISABLE_PUSH_NOTIFICATIONS === 'true';
export const DISABLE_EMAIL_NOTIFICATIONS = process.env.DISABLE_EMAIL_NOTIFICATIONS === 'true';
export const SMTP_HOST = process.env.SMTP_HOST ?? '';
export const SMTP_PORT = parseInt(process.env.SMTP_PORT ?? '587', 10);
export const EMAIL_NOTIFICATION_SENDER =
  process.env.EMAIL_NOTIFICATION_SENDER ?? 'no-reply@example.com';

/* JWT Token User Fields */
export const TOKEN_USER_ID_FIELD = process.env.TOKEN_USER_ID_FIELD ?? 'sub';
export const TOKEN_NAME_FIELD = process.env.TOKEN_NAME_FIELD ?? 'name';
export const TOKEN_USERNAME_FIELD = process.env.TOKEN_USERNAME_FIELD ?? 'uid';
export const TOKEN_EMAIL_FIELD = process.env.TOKEN_EMAIL_FIELD ?? 'email';
