# Feedback API Layer
Feedback API Layer manages the communication with the endpoint of feedback microservice.

## Configure your project
* Include the script in the root.
    ```js
    import '@one-platform/feedback-api-layer/dist/feedback';
    ```
    * #### Angular
        ```bash
        src/index.html
        ```
    * #### Vue
        ```bash
        public/index.html
        ```
    * #### React
        ```bash
        public/index.html
        ```

## Usage
```window.sendFeedback(apiUrl, authToken, feedbackInput)``` is the helper function used to send the feedback to the API endpoint mentioned with the parameters.

```apiUrl``` - Endpoint for pushing the data from client.

```authToken``` - Authentication Token for the API request.

```feedbackInput``` - Feedback input data for the mutation.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)

Copyright (c) 2021 Red Hat One Platform
