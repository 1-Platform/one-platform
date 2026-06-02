# Reverse Proxy

A simple express server that acts as a reverse-proxy/authentication layer for some internal services and APIs.

Currently, the reverse-proxy contains middleware rules for:

- CouchDB: An open-source document-oriented NoSQL database.
- Keycloak Auth: An auth middleware to apply Keycloak SSO Auth to some restricted URLs
- A no-cors proxy middleware: Used for API Catalog
- User blacklist: Optional file-backed blocklist checked before upstream proxy

## User blacklist

When `BLACKLIST_FILE_PATH` is set, the service loads a text file of blocked user identifiers once at startup. Restart the service to pick up file changes.

### File format

See [`blacklist.example.txt`](blacklist.example.txt). One value per line; empty lines and lines starting with `#` are ignored. Each line is matched if it equals the user's `uid` or `email` (case-insensitive) from their token.

### How identity is resolved

| Route | Identity source |
|-------|-----------------|
| `/api/couchdb`, `/api/no-cors-proxy` | `Authorization: Bearer` access token (verified with Keycloak public key) |
| SPA catch-all (`GET *`) | OIDC session `idToken` when the user is logged in |

Requests without a verifiable identity are not blocked by the blacklist (other auth rules may still apply).

Blocked users receive `403` with `{ "error": "Access denied" }`.

### Deployment

Mount the blacklist file at the path given by `BLACKLIST_FILE_PATH` (for example via a Kubernetes ConfigMap).

## License

This sub-package, like it's parent monorepository, is licensed under [MIT License](../../LICENSE).
