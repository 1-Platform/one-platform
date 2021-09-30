import { createHmac } from "crypto";
import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { COUCHDB_HOST, COUCHDB_SECRET } from "../config/env";

const useSecureSSL = process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0";

export default function resolver(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { uid, role, rhatUUID } = res.locals.user;

  /* Adding additional roles */
  role.push("user:" + uid, "user:" + rhatUUID, "op-users");

  const token = createHmac("sha1", COUCHDB_SECRET as string)
    .update(uid)
    .digest("hex");

  const proxy = createProxyMiddleware({
    target: COUCHDB_HOST,
    secure: useSecureSSL,
    changeOrigin: true,
    headers: {
      "X-Auth-CouchDB-UserName": uid,
      "X-Auth-CouchDB-Roles": role.join(","),
      "X-Auth-CouchDB-Token": token,
    },
    pathRewrite: {
      ["^/api/couchdb"]: "",
    },
  });
  proxy(req, res, next);
}
