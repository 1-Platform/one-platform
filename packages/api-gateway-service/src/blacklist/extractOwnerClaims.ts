import { UserClaims } from './types';

export type ApiKeyOwnerUser = {
  uid?: string;
  mail?: string;
};

export function extractOwnerClaims(owner: ApiKeyOwnerUser): UserClaims {
  return {
    uid: typeof owner.uid === 'string' ? owner.uid : undefined,
    email: typeof owner.mail === 'string' ? owner.mail : undefined,
  };
}
