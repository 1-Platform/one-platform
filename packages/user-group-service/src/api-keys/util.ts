import { createHash } from 'crypto';

export function hash (key: string) {
  return createHash( 'sha256' ).update(key).digest('hex');
}
