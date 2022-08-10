import { ApiEmailGroup } from 'api/types';
import { hasUserApiEditAccess } from 'utils';

describe('hasUserApiEditAccess test', () => {
  test('should pass for createdBy', () => {
    const test = hasUserApiEditAccess('1234', {
      createdBy: { rhatUUID: '1234' } as any,
      owners: [{ user: { rhatUUID: 'lorem' } as any, group: ApiEmailGroup.USER }],
    });
    expect(test).toBeTruthy();
  });

  test('should pass for owners', () => {
    const test = hasUserApiEditAccess('1234', {
      createdBy: { rhatUUID: '1234' } as any,
      owners: [{ user: { rhatUUID: '1234' } as any, group: ApiEmailGroup.USER }],
    });
    expect(test).toBeTruthy();
  });

  test('should fail for not owners/createdBy', () => {
    const test = hasUserApiEditAccess('1234', {
      createdBy: { rhatUUID: 'lorem' } as any,
      owners: [{ user: { rhatUUID: 'lorem' } as any, group: ApiEmailGroup.USER }],
    });
    expect(test).toBeFalsy();
  });
});
