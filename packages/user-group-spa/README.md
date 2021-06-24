# User Group SPA

This is a front-end application for the One Platform User Group Microservice, that allows the users to manage Groups and view User Profiles and permissions.

## Setup

To setup the config, you'll need to edit the `public/config.js` file.

It just needs the api url and the name of the environment.

```js
window.UserGroup = ( () => {
  return {
    isPreset: true,
    name: 'local',
    api: "http://localhost:8083/graphql",
  };
})();
```

And that's it. The App is ready to build and deploy.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run watch`

Builds the app in watch mode.<br />
Useful for when the app is mounted in docker-compose for testing/development along with the SSI.

The page has to be manually refreshed if you make edits.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Contributors

👤 **Mayur Deshmukh** ([@deshmukhmayur](https://github.com/deshmukhmayur))

👤 **Ghanshyam Lohar** ([@ghanlohar](https://github.com/ghanlohar))
