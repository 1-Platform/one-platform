import { NextFunction, Request, Response } from 'express';
import { extractUserClaims } from '../blacklist/extractUserClaims';
import {
  getBlacklistIndex,
  isBlacklistEnabled,
} from '../blacklist/blacklist';
import { isUserBlacklisted } from '../blacklist/isUserBlacklisted';
import logger from '../setup/logger';
import { verifyJwtToken } from '../utils/verifyJwtToken';

const blacklistOidc = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!isBlacklistEnabled()) {
    next();
    return;
  }

  if (!req.oidc?.isAuthenticated()) {
    next();
    return;
  }

  const idToken = req.oidc.idToken;
  if (!idToken) {
    next();
    return;
  }

  verifyJwtToken(idToken, (err: Error | null, tokenParsed: Record<string, unknown>) => {
    if (err) {
      logger.warn('blacklist: failed to verify OIDC idToken', {
        message: err.message,
      });
      next();
      return;
    }

    const claims = extractUserClaims(tokenParsed);
    if (isUserBlacklisted(getBlacklistIndex(), claims)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    next();
  });
};

export default blacklistOidc;
