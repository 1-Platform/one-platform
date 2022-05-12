/* eslint-disable no-console */
import crypto from 'crypto';

export const isAlreadyEncrypted = (data: string) => {
  if (!data.includes(':')) return false;
  const [ivHex]: string[] = data.split(':');
  const iv = Buffer.from(ivHex, 'hex');

  if (Buffer.byteLength(iv) === 16) {
    return true;
  }
  return false;
};

export const encrypt = (key: string, data: string) => {
  try {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    const encoding = cipher.update(data);
    const encryptedData = Buffer.concat([encoding, cipher.final()]);
    return `${iv.toString('hex')}:${encryptedData.toString('hex')}`;
  } catch (error) {
    console.error(error);
    return data;
  }
};

export const decrypt = (key: string, data: string) => {
  try {
    const [ivHex, encryptedDataHex]: string[] = data.includes(':') ? data.split(':') : [];
    if (!ivHex) {
      return data;
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedData = Buffer.from(encryptedDataHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    const decryptedEncoding = decipher.update(encryptedData);
    const decryptedData = Buffer.concat([decryptedEncoding, decipher.final()]);
    return decryptedData.toString();
  } catch (error) {
    console.error(error);
    return data;
  }
};
