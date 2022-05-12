import pino, { Logger, LoggerOptions } from 'pino';

export const setupLogger = (): Logger<LoggerOptions> => {
  const logger = pino();

  return logger;
};
