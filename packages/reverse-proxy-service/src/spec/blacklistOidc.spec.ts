import { NextFunction, Request, Response } from 'express';
import blacklistOidc from '../middleware/blacklistOidc';
import * as blacklistModule from '../blacklist/blacklist';
import * as verifyJwtModule from '../utils/verifyJwtToken';

jest.mock('../blacklist/blacklist');
jest.mock('../utils/verifyJwtToken');

const mockIsBlacklistEnabled = blacklistModule.isBlacklistEnabled as jest.Mock;
const mockGetBlacklistIndex = blacklistModule.getBlacklistIndex as jest.Mock;
const mockVerifyJwtToken = verifyJwtModule.verifyJwtToken as jest.Mock;

function runMiddleware(req: Partial<Request>): Promise<Response> {
  return new Promise((resolve) => {
    const next: NextFunction = () => resolve(res);
    const json = jest.fn(() => resolve(res));
    const status = jest.fn(() => ({ json }));
    const res = { status } as unknown as Response;
    blacklistOidc(req as Request, res, next);
  });
}

describe('blacklistOidc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsBlacklistEnabled.mockReturnValue(true);
    mockGetBlacklistIndex.mockReturnValue({
      entries: new Set(['550e8400-e29b-41d4-a716-446655440000']),
    });
  });

  it('passes through when blacklist is disabled', async () => {
    mockIsBlacklistEnabled.mockReturnValue(false);
    const res = await runMiddleware({
      oidc: { isAuthenticated: () => true } as Request['oidc'],
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes through when user is not authenticated', async () => {
    const res = await runMiddleware({
      oidc: {
        isAuthenticated: () => false,
        idToken: undefined,
      } as Request['oidc'],
    });
    expect(mockVerifyJwtToken).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes through when idToken verification fails', async () => {
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: Error) => void) => {
        cb(new Error('invalid'));
      }
    );
    const res = await runMiddleware({
      oidc: {
        isAuthenticated: () => true,
        idToken: 'bad-id-token',
      } as Request['oidc'],
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when user is blacklisted', async () => {
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: null, payload: object) => void) => {
        cb(null, {
          uid: '550e8400-e29b-41d4-a716-446655440000',
        });
      }
    );
    const res = await runMiddleware({
      oidc: {
        isAuthenticated: () => true,
        idToken: 'valid-id-token',
      } as Request['oidc'],
    });
    expect(res.status).toHaveBeenCalledWith(403);
    const json = (res.status as jest.Mock).mock.results[0].value.json;
    expect(json).toHaveBeenCalledWith({ error: 'Access denied' });
  });

  it('passes through when user is not blacklisted', async () => {
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: null, payload: object) => void) => {
        cb(null, { uid: 'allowed', email: 'allowed@example.com' });
      }
    );
    const res = await runMiddleware({
      oidc: {
        isAuthenticated: () => true,
        idToken: 'valid-id-token',
      } as Request['oidc'],
    });
    expect(res.status).not.toHaveBeenCalled();
  });
});
