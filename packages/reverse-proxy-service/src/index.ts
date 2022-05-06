import getServer from './server';
import setupDatabaseConnection, { disconnectDatabase } from './setup/database';
import { PORT } from './setup/env';
import logger from './setup/logger';

(async () => {
  await setupDatabaseConnection();

  const server = (await getServer()).listen(PORT, () => {
    logger.info(`Reverse proxy listening on port ${PORT}`);
  });

  async function closeServer() {
    server.close();
    await disconnectDatabase();
  }

  process.on('SIGINT', closeServer);
  process.on('SIGTERM', closeServer);
})();
