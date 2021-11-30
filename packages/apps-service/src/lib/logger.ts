import {
  createLogger, format, LoggerOptions, transports,
} from 'winston';
import { NODE_ENV } from '../setup/env';

export const winstonOptions: LoggerOptions = {
  transports: [
    new transports.Console(),
  ],
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  silent: NODE_ENV === 'test',
};

const logger = createLogger(winstonOptions);

export default logger;
