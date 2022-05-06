import { getApps } from '../setup/database';
import logger from '../setup/logger';

let allApps: any[];

const getApplicationCache = async () => {
  if (!allApps) {
    await updateApplicationCache();
  }
  return allApps;
};

export const updateApplicationCache = async () => {
  /* Build application cache */
  const apps = await getApps()
    .find(
      {},
      { projection: { name: 1, path: 1, isActive: 1, authenticate: 1 } }
    )
    .toArray();

  if (apps?.length === 0) {
    return;
  }
  logger.debug('updating application cache');
  logger.debug({ newApps: apps, oldApps: JSON.stringify(allApps) });

  try {
    allApps = [
      ...apps
        .map((app) => ({
          name: app.name,
          path: app.path,
          authenticate: app.authenticate,
          isActive: app.isActive,
        }))
        .sort((prev, next) => {
          return next.path?.length - prev.path?.length;
        }),
    ];
  } catch (err) {
    logger.warn('error while updating application cache:', err);
  }
};

export default getApplicationCache;
