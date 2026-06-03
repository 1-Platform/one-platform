import { loadBlacklistFromFile } from './loadBlacklistFromFile';
import { BlacklistIndex } from './types';

const emptyIndex = (): BlacklistIndex => ({ entries: new Set<string>() });

let blacklistIndex: BlacklistIndex = emptyIndex();

function getBlacklistFilePath(): string | undefined {
  const path = process.env.BLACKLIST_FILE_PATH?.trim();
  return path || undefined;
}

export function isBlacklistEnabled(): boolean {
  return Boolean(getBlacklistFilePath());
}

export function getBlacklistIndex(): BlacklistIndex {
  return blacklistIndex;
}

export async function initBlacklist(): Promise<void> {
  const filePath = getBlacklistFilePath();
  if (!filePath) {
    blacklistIndex = emptyIndex();
    return;
  }
  blacklistIndex = await loadBlacklistFromFile(filePath);
}
