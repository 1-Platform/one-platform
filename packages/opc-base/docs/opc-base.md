# opc-base

![Version](https://img.shields.io/badge/version-1.0.1.beta-blue.svg?cacheSeconds=2592000)
![Build Status](https://travis-ci.org/dwyl/esta.svg?branch=master)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)

opc-base is the core component that contains the shared logic between the components inside opc-base. It's a singleton class that has a controlled accessbility.

## Usage

### Universal Module Definition (UMD)

On using as UMD `opc-base` is injected as global variable. Copy and paste this snippet to top of your html file.

```html
<script src="https://unpkg.com/@one-platform/opc-base@1.0.1-beta/dist/umd/opc-base.js"></script>
<script>
  opcBase.configure({
    apiBasePath: "<api base for fetching app list>",
    subscriptionsPath: "<subscriptions base url for notifications>",
    keycloakUrl: "<keycloak url>",
    keycloakClientId: "<keycloak client id>",
    keycloakRealm: "<keycloak clock realm>",
  });
</script>
```

### ES

#### Install opc-base

```sh
npm install --save @one-platform/opc-base
```

#### Import and initialize opc-base

```js
import opcBase from "@one-platform/opc-base";

opcBase.configure({
  apiBasePath: "<api base for fetching app list>",
  subscriptionsPath: "<subscriptions base url for notifications>",
  keycloakUrl: "<keycloak url>",
  keycloakClientId: "<keycloak client id>",
  keycloakRealm: "<keycloak clock realm>",
});
```

## API Reference

### Methods

###### opcBase.configure

opcBase.configure must be called before using any other package of this library. It saves the keycloak config and base path url to server. This method also initiates the authentication.

Object properties

- apiBasePath: api base for fetching app list
- subscriptionsPath: subscriptions base url for notifications
- keycloakUrl: keycloak url
- keycloakClientId: keycloak client id
- keycloakRealm: keycloak clock realm
- cachePolicy (optional): The fetch policy strategy followed by the apollo instance used in opc-base. By default `cache-first`

###### opcBase.auth

opcBase.auth contains the authentication component.

Object methods

- `opcBase.auth.init()`: This function starts the keycloak authentication flow. Its called onmount of `opc-provider`
- `opcBase.auth.logout()`: To logout the user
- `opcBase.auth.isAuthenticated`: To check user is authenticated or not
- `opcBase.auth.getUserInfo`: To retrieve logged in user information
- `opcBase.auth.jwtToken`: To get jwt token of user

For detailed information ref [type definitiation](../src/keycloakAuthProvider/keycloakAuthProvider.ts)

###### opcBase.api

opcBase.api contains the apollo client instance with the `apiBasepath` and `subscriptionsPath` set.

###### opcBase.toast

It contains toast function to show various notification taost. Toast component can be accessed both from opcBase.toast.

Object methods

- `opcBase.toast.showToast` : A function to show toast notification.It accepts two arguments

  - notification: data of notification like id, title, subject etc
  - options: to change variants like success, danger, warning and other config.
    Definitions are available in [types](../src/opc-base/types.ts).

- `opcBase.toast.success`: Same as showToast with variant as success.
- `opcBase.toast.warn`: Same as showToast with variant as warning.
- `opcBase.toast.danger`: Same as showToast with variant as danger.
- `opcBase.toast.info`: Same as showToast with variant as info.
- `opcBase.toast.muted`: Same as showToast with variant as muted.

###### opcBase.feedback

It contains the feedback components of opc-base. Feedback component can be accessed both from opcBase.feedback.

Object methods

- `opcBase.feedback.sendFeedback` : A function to send feedback to op team.

## 🤝 Contributors

👤 **[akhilmhdh](https://github.com/akhilmhdh)**
