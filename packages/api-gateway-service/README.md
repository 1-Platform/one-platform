# API Gateway

API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring.

## Local Development using docker-compose (recommended)

1. Copy the `.env.example` to `.env`. Change/modify the variable values as required.
2. Change the URIs in `config.json` and add/remove the microservices as needed
3. Then run the docker-compose service using
   ```bash
   docker-compose up api-gateway
   ```
   The above command will start all the dependent services from this project. (Make sure any external microservices added in step 2 are running and accessible)

*Note:* Before starting the gateway, also make sure the microservices in this project are configured properly.

## User blacklist

When `BLACKLIST_FILE_PATH` is set, the gateway loads a text file of blocked user identifiers once at startup. Restart the gateway to pick up file changes.

```env
BLACKLIST_FILE_PATH=./blacklist.txt
```

See [`blacklist.example.txt`](blacklist.example.txt). One **uid** or **email** per line; empty lines and `#` comments are ignored.

Regenerate from Compass:

```bash
node scripts/generate-blacklist-from-compass-output.mjs <catalog-entity.json>
```

Matching uses the **token owner** identity (not `rhatUUID`):

- **JWT:** Keycloak `uid` and `email` (or `mail`) from the access token
- **API key:** owning user's `uid` and `mail` from User Group when `ownerType` is `User`

Downstream forwarding still uses `rhatUUID` in Apollo context / `X-OP-User-ID` for JWTs. Group-owned API keys are not evaluated against the blacklist.

OpenShift: [openshift/README.md](openshift/README.md).

## Running Tests

```bash
npm test
```

## Contributors:

👤 **Rigin Oommen** [@riginoommen](https://github.com/riginoommen)
👤 **Mayur Deshmukh** [@deshmukhmayur](https://github.com/deshmukhmayur)
