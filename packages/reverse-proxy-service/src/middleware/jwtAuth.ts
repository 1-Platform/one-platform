import { NextFunction, Request, Response } from 'express';
import { parseBearerToken } from '../utils/parseBearerToken';
import { verifyJwtToken } from '../utils/verifyJwtToken';

const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (res.locals.user) {
      next();
      return;
    }

    const token = parseBearerToken(req.headers?.authorization);
    if (!token) {
      throw new Error('Request is not authenticated');
    }

    verifyJwtToken(token, (err: any, tokenParsed: any) => {
      if (err) {
        throw new Error(err.message);
      }
      res.locals.user = tokenParsed;
      res.locals.authenticated = true;
      next();
    });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export default jwtAuth;
