import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const useSecureSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

export default function resolver(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const url = req.params?.url as string;
  let targetUrl: URL;
  const query = new URLSearchParams(req.query as Record<string, string>);

  try {
    targetUrl = new URL(url);
    targetUrl.search = query.toString();
  } catch (error) {
    res.status(403).json({ error: 'Invalid proxy url' });
    return;
  }

  const proxy = createProxyMiddleware({
    target: targetUrl.toString(),
    secure: useSecureSSL,
    changeOrigin: true,
    ignorePath: true,
  });
  proxy(req, res, next);
}
