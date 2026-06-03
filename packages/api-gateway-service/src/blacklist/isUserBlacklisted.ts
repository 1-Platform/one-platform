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
    console.info('user is blacklisted by uid', user);
    return true;
  }

  if (user.email && entries.has(user.email.toLowerCase())) {
    console.info('user is blacklisted by email', user);
    return true;
  }

  return false;
}
