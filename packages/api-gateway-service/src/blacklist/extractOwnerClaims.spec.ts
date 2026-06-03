import { extractOwnerClaims } from './extractOwnerClaims';
import { parseBlacklistFile } from './parseBlacklistFile';
import { isUserBlacklisted } from './isUserBlacklisted';

describe('extractOwnerClaims', () => {
  it('maps uid and mail to UserClaims', () => {
    expect(
      extractOwnerClaims({ uid: 'jdoe', mail: 'jdoe@redhat.com' })
    ).toEqual({
      uid: 'jdoe',
      email: 'jdoe@redhat.com',
    });
  });

  it('omits missing fields', () => {
    expect(extractOwnerClaims({})).toEqual({
      uid: undefined,
      email: undefined,
    });
  });
});

describe('API key owner blacklist', () => {
  const index = parseBlacklistFile('jdoe\nblocked@redhat.com');

  it('blocks User owner when uid is listed', () => {
    const claims = extractOwnerClaims({ uid: 'jdoe', mail: 'jdoe@redhat.com' });
    expect(isUserBlacklisted(index, claims)).toBe(true);
  });

  it('blocks User owner when mail is listed', () => {
    const claims = extractOwnerClaims({
      uid: 'other',
      mail: 'blocked@redhat.com',
    });
    expect(isUserBlacklisted(index, claims)).toBe(true);
  });

  it('allows User owner when neither field matches', () => {
    const claims = extractOwnerClaims({
      uid: 'allowed',
      mail: 'allowed@redhat.com',
    });
    expect(isUserBlacklisted(index, claims)).toBe(false);
  });
});
