import { SMTP_HOST, SMTP_PORT } from '@setup/env';
import { createTransport } from 'nodemailer';

export const emailTransport = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false, // do not fail on invalid certs
  },
  logger: false,
  transactionLog: false,
  debug: false, // include SMTP traffic in the logs
  disableFileAccess: true,
  disableUrlAccess: true,
});
