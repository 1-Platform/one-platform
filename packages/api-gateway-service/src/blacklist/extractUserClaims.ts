// Identity for blacklist is the JWT token owner (uid / email only, never rhatUUID).

import { UserClaims } from './types';

/** Keycloak uid of the human token owner. */
export function extractTokenOwnerClaims(
  payload: Record<string, unknown>,
): UserClaims {
  const uid = typeof payload.uid === 'string' ? payload.uid : undefined;
  const email =
    typeof payload.email === 'string'
      ? payload.email
      : typeof payload.mail === 'string'
        ? payload.mail
        : undefined;
  return { uid, email };
}

/** @deprecated Use extractTokenOwnerClaims */
export function extractUserClaims(
  payload: Record<string, unknown>,
): UserClaims {
  return extractTokenOwnerClaims(payload);
}
