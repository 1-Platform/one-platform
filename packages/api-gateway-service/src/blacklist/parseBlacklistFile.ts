import { BlacklistIndex } from './types';

export function parseBlacklistFile(content: string): BlacklistIndex {
  const entries = new Set<string>();

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.length === 0 || trimmed.startsWith('#')) {
      continue;
    }
    entries.add(trimmed);
  }

  return { entries };
}
