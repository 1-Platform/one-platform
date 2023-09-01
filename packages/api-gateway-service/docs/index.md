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

## Running Tests

```bash
npm test
```

## Contributors:

👤 **Rigin Oommen** [@riginoommen](https://github.com/riginoommen)
👤 **Mayur Deshmukh** [@deshmukhmayur](https://github.com/deshmukhmayur)
