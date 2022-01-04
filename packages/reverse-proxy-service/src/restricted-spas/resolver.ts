import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { SPASHIP_ROUTER_HOST } from '../config/env';

const useSecureSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";

export function rhelDeveloperGuide ( req: Request, res: Response, next: NextFunction ): void {
  const proxy = createProxyMiddleware( {
    target: SPASHIP_ROUTER_HOST,
    secure: useSecureSSL,
    changeOrigin: true,
    headers: {
      'X-OP-Authenticated': 'true',
    },
  } );

  proxy( req, res, next );
}
