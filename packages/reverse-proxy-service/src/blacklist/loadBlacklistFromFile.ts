import { readFile } from 'fs/promises';
import logger from '../setup/logger';
import { parseBlacklistFile } from './parseBlacklistFile';
import { BlacklistIndex } from './types';

const emptyIndex = (): BlacklistIndex => ({ entries: new Set<string>() });

export async function loadBlacklistFromFile(
  path: string
): Promise<BlacklistIndex> {
  try {
    const content = await readFile(path, 'utf8');
    const index = parseBlacklistFile(content);
    logger.info(`blacklist loaded: ${index.entries.size} entries`);
    return index;
  } catch (err) {
    logger.error('failed to load blacklist file', { path, err });
    return emptyIndex();
  }
}
