import { NextFunction, Request, Response } from 'express';
import { requiresAuth } from 'express-openid-connect';
import getApplicationCache from '../utils/applicationCache';

export default async (req: Request, res: Response, next: NextFunction) => {
  const apps = await getApplicationCache();
  const app = apps.find((app) => req.url.startsWith(app.path));

  if (app && app.authenticate) {
    return requiresAuth()(req, res, next);
  }

  return next();
};
