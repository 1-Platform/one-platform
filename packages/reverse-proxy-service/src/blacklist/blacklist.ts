import { BLACKLIST_FILE_PATH } from '../setup/env';
import { loadBlacklistFromFile } from './loadBlacklistFromFile';
import { BlacklistIndex } from './types';

const emptyIndex = (): BlacklistIndex => ({ entries: new Set<string>() });

let blacklistIndex: BlacklistIndex = emptyIndex();

export function isBlacklistEnabled(): boolean {
  return Boolean(BLACKLIST_FILE_PATH?.trim());
}

export function getBlacklistIndex(): BlacklistIndex {
  return blacklistIndex;
}

export async function initBlacklist(): Promise<void> {
  if (!isBlacklistEnabled()) {
    blacklistIndex = emptyIndex();
    return;
  }
  blacklistIndex = await loadBlacklistFromFile(BLACKLIST_FILE_PATH as string);
}
