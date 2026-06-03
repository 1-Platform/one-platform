import { extractTokenOwnerClaims } from './extractUserClaims';
import { parseBlacklistFile } from './parseBlacklistFile';
import { isUserBlacklisted } from './isUserBlacklisted';

describe('extractTokenOwnerClaims', () => {
  it('uses uid and email from JWT payload', () => {
    expect(
      extractTokenOwnerClaims({
        uid: 'jdoe',
        email: 'jdoe@redhat.com',
        rhatUUID: 'uuid-should-not-be-used',
      })
    ).toEqual({
      uid: 'jdoe',
      email: 'jdoe@redhat.com',
    });
  });

  it('falls back to mail when email claim is absent', () => {
    expect(
      extractTokenOwnerClaims({
        uid: 'jdoe',
        mail: 'jdoe@redhat.com',
        rhatUUID: 'uuid-123',
      })
    ).toEqual({
      uid: 'jdoe',
      email: 'jdoe@redhat.com',
    });
  });

  it('does not blacklist when only rhatUUID matches a listed uuid-like entry', () => {
    const index = parseBlacklistFile('uuid-123');
    const claims = extractTokenOwnerClaims({
      rhatUUID: 'uuid-123',
      uid: 'allowed-user',
    });
    expect(isUserBlacklisted(index, claims)).toBe(false);
  });

  it('blacklists token owner by uid when listed', () => {
    const index = parseBlacklistFile('jdoe');
    const claims = extractTokenOwnerClaims({
      uid: 'jdoe',
      rhatUUID: 'other-uuid',
    });
    expect(isUserBlacklisted(index, claims)).toBe(true);
  });
});
