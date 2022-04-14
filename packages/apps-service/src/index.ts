import { getApp } from './app';
import logger from './lib/logger';
import setupDatabase from './setup/database';
import { PORT } from './setup/env';

(async () => {
  /* Initialize database connection */
  await setupDatabase();

  const app = await getApp();

  app.listen(PORT).then(({ url }) => {
    logger.info(`App Service ready at ${url}`);
  });
})();
