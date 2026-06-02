import { UserClaims } from './types';

export function extractUserClaims(payload: Record<string, unknown>): UserClaims {
  return {
    uid: typeof payload.uid === 'string' ? payload.uid : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
  };
}
