import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../utils/verifyJwtToken";

const jwtAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    if (!req.headers?.authorization) {
      throw new Error("Request is not authenticated");
    }
    const authorization = req.headers.authorization;
    const [authType, token] = authorization.split(" ");
    if (authType === "Bearer") {
      verifyJwtToken(token, (err: any, tokenParsed: any) => {
        if (err) {
          throw new Error(err.message);
        }
        res.locals.user = tokenParsed;
        res.locals.authenticated = true;
        next();
      });
    } else {
      throw new Error(`Authentication method not supported`);
    }
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export default jwtAuth;
