import { parseBlacklistFile } from './parseBlacklistFile';
import { isUserBlacklisted } from './isUserBlacklisted';

describe('parseBlacklistFile', () => {
  it('ignores empty lines and comments', () => {
    const index = parseBlacklistFile(`
# comment
jdoe

blocked@example.com
    `);
    expect(index.entries.size).toBe(2);
    expect(index.entries.has('jdoe')).toBe(true);
    expect(index.entries.has('blocked@example.com')).toBe(true);
  });

  it('keeps values containing colons as literal entries', () => {
    const index = parseBlacklistFile('user:name@example.com');
    expect(index.entries.has('user:name@example.com')).toBe(true);
  });
});

describe('isUserBlacklisted', () => {
  const index = parseBlacklistFile('jdoe\nblocked@example.com\nuuid-123');

  it('matches uid', () => {
    expect(isUserBlacklisted(index, { uid: 'jdoe' })).toBe(true);
  });

  it('matches email case-insensitively', () => {
    expect(isUserBlacklisted(index, { email: 'Blocked@Example.com' })).toBe(
      true
    );
  });

  it('returns false when no field matches', () => {
    expect(
      isUserBlacklisted(index, {
        uid: 'other',
        email: 'other@example.com',
      })
    ).toBe(false);
  });

  it('returns false for empty blacklist', () => {
    expect(isUserBlacklisted({ entries: new Set() }, { uid: 'jdoe' })).toBe(
      false
    );
  });
});
