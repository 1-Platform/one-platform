import { verify } from 'jsonwebtoken';
import { KEYCLOAK_PUBKEY } from '../setup/env';

/**
 * Verifies the JWT Token
 */
export function verifyJwtToken(token: string, callback: any) {
  return verify(token, getPublicKey(), callback);
}

/* Function to fetch the public key from internal IDP */
const formatAsPem = (str: string) => {
  const keyHeader = '-----BEGIN PUBLIC KEY-----';
  const keyFooter = '-----END PUBLIC KEY-----';
  let formatKey = '';
  if (str.startsWith(keyHeader) && str.endsWith(keyFooter)) {
    return str;
  }

  if (str.split('\n').length === 1) {
    while (str.length > 0) {
      formatKey += `${str.substring(0, 64)}\n`;
      str = str.substring(64);
    }
  }

  return `${keyHeader}\n${formatKey}${keyFooter}`;
};

function getPublicKey(): string {
  const publicKey = KEYCLOAK_PUBKEY;

  if (publicKey && publicKey.trim().length > 0) {
    return formatAsPem(publicKey);
  }
  throw Error(
    'No Keycloak Public Key found! Please configure it by setting the KEYCLOAK_PUBKEY environment variable.'
  );
}
