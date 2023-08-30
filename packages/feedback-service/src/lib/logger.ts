import {createLogger, format, LoggerOptions, transports} from 'winston';

export const winstonOptions: LoggerOptions = {
  transports: [new transports.Console()],
  format: format.combine(format.timestamp(), format.json()),
  silent: process.env.NODE_ENV === 'test',
};

export default createLogger(winstonOptions);
