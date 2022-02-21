import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const useSecureSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0';

const isValidURL = (url: string) => new URL(url);

export default function resolver(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const url = req.params?.url as string;
  try {
    isValidURL(url);
  } catch (error) {
    res.status(403).json({ error: 'Invalid proxy url' });
    return;
  }

  const proxy = createProxyMiddleware({
    target: url,
    secure: useSecureSSL,
    changeOrigin: true,
    pathRewrite: (path) => path.replace(`/api/no-cors-proxy/${url}`, ''),
  });
  proxy(req, res, next);
}
