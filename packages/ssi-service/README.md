# SSI Templates

This package contains global webcomponents for SSI and Chroming.

## List of available web components

1. [`op-nav`](./src/nav/): Global header for One Portal SPAs
2. [`op-feedback-panel`](./src/feedback-panel/): A Feedback button/panel for submitting bug reports & feedback directly from anywhere

### Usage

1. Add a `secrets.json` file in `/packages/ssi-service/src/feedback-panel/` with appropriate values for apiUrl and accessToken. (You can use the `secrets.example.json` as an example).

   ```bash
   # Make a copy of the secrets.example.json
   mv ./ssi-service/src/feedback-panel/secrets.example.json ./ssi-service/src/feedback-panel/secrets.json

   # Edit the secrets file
   nano ./ssi-service/src/feedback-panel/secrets.json
   ```

2. Run the docker-compose service

   ```bash
   # Start the docker-compose service
   docker-compose up ssi-templates
   ```

   **Testing the ssi-template with other SPAs**

   1. Follow the above steps to create a `secrets.json` file
   2. Mount your SPA build as a volume in the the docker-compose `ssi-templates` service

   ```yml
   ...
   services:
     ssi-templates:
       ...
       volumes:
         - ./packages/<spa-package>/build/:/usr/local/apache2/htdocs/<spa-name>/
   ```

3. Start the docker-compose

   ```bash
   docker-compose up ssi-templates
   ```

   **Testing**

   To run unit tests, use any of the following commands:

   ```bash
   npm run test
   npm test
   npm t
   ```

   And to generate coverage report, use:

   ```bash
   npm test -- --coverage
   ```

   You can find the generated coverage reports inside `tests/coverage/`.

### Contributors

- Mayur Deshmukh ([@deshmukhmayur](https://github.com/deshmukhmayur))
