# opc-provider Component 👋

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)
![Build Status](https://travis-ci.org/dwyl/esta.svg?branch=master)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)

opc-provider is a container component that injects business logic of one-platform SSI components. It injects notification subscription, toast, feedback function, and other utility functions.

## Prerequisites

opc-provider needs access to keylock configuration. Thus opcBase must be imported initialized before this component is used.

### Umd

```js
<script src="@one-platform/opc-base/umd/opc-base.js"></script>
<script>
opcBase.configure( {
    apiBasePath: '<api base for fetching app list>',
    subscriptionsPath: '<subscriptions base url for notifications>',
    keycloakUrl: '<keycloak url>',
    keycloakClientId: '<keycloak client id>',
    keycloakRealm: '<keycloak clock realm>',
} );
</script>
```

### ES

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

## Guidelines

`opc-provider` only contains the business logic for `opc-nav`, `opc-menu-drawer`, `opc-notification-drawer`, `opc-feedback`. These components are not included in `opc-provider` to keep the bundle small. They must be imported accordingly. `opc-provider` does provide a toast component direcly injected to its shadow dom.

The components expected for opc-provider as provided in opc-components library. Visit the documentation to install and use these in your frameworks.

1. [opc-nav](https://github.com/1-Platform/op-components/tree/master/packages/opc-nav)
2. [opc-menu-drawer](https://github.com/1-Platform/op-components/tree/master/packages/opc-menu-drawer)
3. [opc-notification-drawer](https://github.com/1-Platform/op-components/tree/master/packages/opc-notification-drawer)
4. [opc-feedback](https://github.com/1-Platform/op-components/tree/master/packages/opc-feedback)

### Full SSI

The full SSI theme contains a nav, menu drawer, notification drawer, and feedback button. These components need to be imported and added inside opc-provider.

```html
<opc-provider>
  <opc-nav></opc-nav>
  <opc-menu-drawer></opc-menu-drawer>
  <opc-notification-drawer></opc-notification-drawer>
  <opc-feedback></opc-feedback>
</opc-provider>
```

### Top Nav Only

The top nav design consists of only the `opc-nav` and drawer components. If the drawer is also not needed, then override the default menu buttons in the navbar with the slot `opc-nav-btn` to avoid the error of the undefined drawer as the default event emitter clicks to open the drawer.

```html
<opc-provider>
  <opc-nav></opc-nav>
</opc-provider>
```

### Feedback Only

Feedback only design consists of only the feedback button.

```html
<opc-provider>
  <opc-feedback></opc-feedback>
</opc-provider>
```

## Slots

`opc-provider` has only default slot.

## Attributes

1. isWarningHidden
   - Default: `true`
   - Desc: It shows the warning from provider in console

```html
<opc-provider isWarningHidden> </opc-provider>
```

## Usage

### Install opc-provider

```sh
npm install --save @one-platform/opc-base
```

### For VanillaJS

- Import component

```js
import "@one-platform/opc-base/dist/opc-provider";
```

- Add component in html

```html
<opc-provider></opc-provider>
```

### For Angular

- In your app.module include the `CUSTOM_ELEMENTS_SCHEMA` and import the component

```js
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import "@one-platform/opc-base/dist/opc-provider";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

- Add component in any component html template

```html
<opc-provider></opc-provider>
```

### For React

- Import the component in App.js

```js
import "@one-platform/opc-base/dist/opc-provider";
```

- Add component in any component html render

```html
<opc-provider></opc-provider>
```

## 🤝 Contributors

👤 **[akhilmhdh](https://github.com/akhilmhdh)**
