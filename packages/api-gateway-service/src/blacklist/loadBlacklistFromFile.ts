import { promises as fs } from 'fs';
import { parseBlacklistFile } from './parseBlacklistFile';
import { BlacklistIndex } from './types';

const emptyIndex = (): BlacklistIndex => ({ entries: new Set<string>() });

export async function loadBlacklistFromFile(
  path: string
): Promise<BlacklistIndex> {
  try {
    const content = await fs.readFile(path, 'utf8');
    const index = parseBlacklistFile(content);
    console.info(`blacklist loaded: ${index.entries.size} entries`);
    return index;
  } catch (err) {
    console.error('failed to load blacklist file', { path, err });
    return emptyIndex();
  }
}
