import { NextFunction, Request, Response } from 'express';
import {
  getBlacklistIndex,
  isBlacklistEnabled,
} from '../blacklist/blacklist';
import { extractUserClaims } from '../blacklist/extractUserClaims';
import { isUserBlacklisted } from '../blacklist/isUserBlacklisted';
import logger from '../setup/logger';
import { parseBearerToken } from '../utils/parseBearerToken';
import { verifyJwtToken } from '../utils/verifyJwtToken';

const blacklistBearer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!isBlacklistEnabled()) {
    next();
    return;
  }

  const token = parseBearerToken(req.headers?.authorization);
  if (!token) {
    next();
    return;
  }

  verifyJwtToken(token, (err: Error | null, tokenParsed: Record<string, unknown>) => {
    if (err) {
      next();
      return;
    }

    const claims = extractUserClaims(tokenParsed);
    if (isUserBlacklisted(getBlacklistIndex(), claims)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.locals.user = tokenParsed;
    res.locals.authenticated = true;
    next();
  });
};

export default blacklistBearer;
