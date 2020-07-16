# SSI Templates

This package contains global web components for One Platform SSI and Chroming.

## List of available web components

1. [`op-nav`](./src/nav/): Global header for One Portal SPAs. Includes the App Menu, Notifications Drawer, User Drawer and Global Search.
2. [`op-feedback-panel`](./src/feedback-panel/): A Feedback button/panel for submitting bug reports & feedback directly from anywhere

## Helper Functions

The following helper function/objects are directly injected in the browser `window` object when the OpNav is inserted into the DOM. So any SPA which has the OpNav included can use the provided features.

### OpAuthHelper

A Javascript object that provides some methods for getting the JWT Token, and User Info.

#### Available methods:

- `onLogin(cb: (user) => void): void`\
   Calls the callback function when the user is successfully logged in. Can be used to check when the user has logged in, to handle any API calls that require authentication.
- `isAuthenticated: boolean`\
   Can be used to check if the user is logged in or not.
- `getUserInfo(): User | null`\
   Returns the user details if the user is logged in, else returns null.

### OpNotification

A Javascript object that provides methods to invoke pop-up notifications within the OpNav.

#### Available Methods

- `showToast(notification, options?): void`\
  Invokes a pop-up notification with the data provided in the `notification` argument.\
  **Arguments:**

  ```ts
  notification: {
    subject: string,            // The title for the notification
    body?: string,               // The description for the notification (optional)
    sentOn?: Date | string,      // string should be in ISO format
    link?: string,
  }

  options: {
    addToDrawer: boolean,       // Whether or not the notification should be added to the drawer (default: false)
    duration: string,           // The duration for the pop-up/toast (default: '5s')
  }
  ```

## Using ssi-templates for local development with other apps

1. Copy the `.env.example` file and rename it as `.env`. Add the values for the environment variables as expected.

   ```bash
   # Make a copy of the secrets.example.json
   mv ./ssi-service/.env.example ./ssi-service/.env

   # Edit the secrets file
   nano ./ssi-service/.env
   ```

2. Add the following import in the `<head>` of all your html files (preferrably at the end of the haed tag)

```html
<head>
  ...
  <!--#include virtual="/.include/nav/default.html" -->
</head>
<body>
  ...
</body>
```

1. Mount your SPA build/dist as a volume in the the docker-compose `ssi-templates` service. (Make sure these is a build/dist directory present).

   ```yml
   ...
   services:
   ssi-templates:
     ...
     volumes:
       - # ...
       - ./packages/<spa-package>/dist/:/var/www/html/<spa-name>/
   ```

2. Start the docker-compose

   ```bash
   docker-compose up -d httpd
   ```

**Note:** For running your app live with the SSI header, the  `serve`/`start` script of your app should keep update the dist directory updated, or else the changes won't be reflected the docker. (It may not work with Angular's `ng serve` as that serves the app without creating a dist directory, so a workaround for that is to build the app every time a change is too be tested)

## Testing

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
