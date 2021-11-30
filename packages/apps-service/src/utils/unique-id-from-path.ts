import { customAlphabet } from 'nanoid';
import logger from '../lib/logger';

const nanoid = customAlphabet('0123456789abcdef', 6);
const defaultAppName = 'app';

function hyphenateString(str: string) {
  return (
    str
      .toLowerCase()
      /* Replace any special characters with `-` */
      // eslint-disable-next-line no-useless-escape
      .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
      /* Remove any starting or ending `-` */
      .replace(/^-+|-+$/g, '')
      /* Removing multiple consecutive `-`s */
      .replace(/--+/g, '-')
  );
}

export default function uniqueIdFromPath(appName: string): string {
  logger.warn(appName);
  const hyphenatedStr = hyphenateString(appName) ?? defaultAppName;
  const uniqueId = nanoid();
  return `${hyphenatedStr}-${uniqueId}`;
}
