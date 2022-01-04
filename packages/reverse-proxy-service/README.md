# Reverse Proxy

A simple express server that acts as a reverse-proxy/authentication layer for some internal services and APIs.

Currently, the reverse-proxy contains middleware rules for:

- CouchDB: An open-source document-oriented NoSQL database.
- Keycloak Auth: An auth middleware to apply Keycloak SSO Auth to some restricted URLs
- A no-cors proxy middleware: Used for API Catalog

## License

This sub-package, like it's parent monorepository, is licensed under [MIT License](../../LICENSE).
