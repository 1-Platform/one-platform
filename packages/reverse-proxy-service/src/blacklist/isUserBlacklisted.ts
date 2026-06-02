import logger from '../setup/logger';
import { BlacklistIndex, UserClaims } from './types';

export function isUserBlacklisted(
  index: BlacklistIndex,
  user: UserClaims,
): boolean {
  const { entries } = index;
  if (entries.size === 0) {
    return false;
  }

  if (user.uid && entries.has(user.uid)) {
    logger.info('user is blacklisted by uid', { user });
    return true;
  }

  if (user.email && entries.has(user.email.toLowerCase())) {
    logger.info('user is blacklisted by email', { user });
    return true;
  }

  return false;
}
