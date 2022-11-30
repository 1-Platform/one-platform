import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789abcdef', 6);
const defaultAppName = 'app';
const nanoidSize = 6;
const maxSize = 32;

function hyphenateString(str: string) {
  return (
    str
      .trim()
      .slice(0, maxSize - nanoidSize)
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
  const hyphenatedStr = hyphenateString(appName) ?? defaultAppName;
  const uniqueId = nanoid(nanoidSize);
  return `${hyphenatedStr}-${uniqueId}`;
}
