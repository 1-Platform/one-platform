import { NextFunction, Request, Response } from 'express';
import blacklistBearer from '../middleware/blacklistBearer';
import * as blacklistModule from '../blacklist/blacklist';
import * as verifyJwtModule from '../utils/verifyJwtToken';

jest.mock('../blacklist/blacklist');
jest.mock('../utils/verifyJwtToken');

const mockIsBlacklistEnabled = blacklistModule.isBlacklistEnabled as jest.Mock;
const mockGetBlacklistIndex = blacklistModule.getBlacklistIndex as jest.Mock;
const mockVerifyJwtToken = verifyJwtModule.verifyJwtToken as jest.Mock;

function runMiddleware(
  req: Partial<Request>,
  locals: Record<string, unknown> = {}
): Promise<Response> {
  return new Promise((resolve) => {
    const next: NextFunction = () => resolve(res);
    const json = jest.fn(() => resolve(res));
    const status = jest.fn(() => ({ json }));
    const res = { status, locals } as unknown as Response;
    blacklistBearer(req as Request, res, next);
  });
}

describe('blacklistBearer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsBlacklistEnabled.mockReturnValue(true);
    mockGetBlacklistIndex.mockReturnValue({
      entries: new Set(['jdoe']),
    });
  });

  it('passes through when blacklist is disabled', async () => {
    mockIsBlacklistEnabled.mockReturnValue(false);
    const res = await runMiddleware({ headers: {} });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes through when no Bearer token', async () => {
    const res = await runMiddleware({ headers: {} });
    expect(mockVerifyJwtToken).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('passes through when JWT verification fails', async () => {
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: Error) => void) => {
        cb(new Error('invalid'));
      }
    );
    const res = await runMiddleware({
      headers: { authorization: 'Bearer bad-token' },
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when user is blacklisted', async () => {
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: null, payload: object) => void) => {
        cb(null, { uid: 'jdoe', email: 'jdoe@example.com' });
      }
    );
    const res = await runMiddleware({
      headers: { authorization: 'Bearer valid-token' },
    });
    expect(res.status).toHaveBeenCalledWith(403);
    const json = (res.status as jest.Mock).mock.results[0].value.json;
    expect(json).toHaveBeenCalledWith({ error: 'Access denied' });
  });

  it('sets res.locals.user when not blacklisted', async () => {
    const payload = {
      uid: 'allowed',
      email: 'allowed@example.com',
    };
    mockVerifyJwtToken.mockImplementation(
      (_token: string, cb: (err: null, p: object) => void) => {
        cb(null, payload);
      }
    );
    const res = await runMiddleware({
      headers: { authorization: 'Bearer valid-token' },
    });
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals.user).toEqual(payload);
    expect(res.locals.authenticated).toBe(true);
  });
});
