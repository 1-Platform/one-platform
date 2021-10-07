# opc-provider Component 👋

![Version](https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000)
![Build Status](https://travis-ci.org/dwyl/esta.svg?branch=master)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)

opc-provider is a container component that injects business logic of one-platform SSI components. It injects notification subscription, toast, feedback function, and other utility functions.

## Prerequisites

opc-provider needs access to keylock configuration. Thus opcBase must be imported initialized before this component is used.

opc-provider is a webcomponent. Use the web component polyfill for proper browser support from IE onwards.

```html
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.0.0/webcomponents-loader.js"></script>
```

### Umd

```js
<script src="https://unpkg.com/@one-platform/opc-base@1.0.2-beta/dist/umd/opc-base.js"></script>
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

### Quick Setup

The following snippets will enable you to setup opc-provider theme components faster.

> You can avoid installing using some of the opc-components according to the [theme](##Themes) you wish to use.

### UMD

```html
<script src="https://unpkg.com/@one-platform/opc-nav@0.0.2-prerelease/dist/opc-nav.js"></script>
<script src="https://unpkg.com/@one-platform/opc-menu-drawer@0.1.1-prerelease/dist/opc-menu-drawer.js"></script>
<script src="https://unpkg.com/@one-platform/opc-notification-drawer@0.1.1-prerelease/dist/opc-notification-drawer.js"></script>
<script src="https://unpkg.com/@one-platform/opc-feedback@0.0.9-prerelease/dist/opc-feedback.js"></script>
<script src="https://unpkg.com/@one-platform/opc-base@1.0.2-beta/dist/umd/opc-base.js"></script>
<script src="https://unpkg.com/@one-platform/opc-base@1.0.2-beta/dist/umd/opc-provider.js"></script>
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

1. NPM install required components

```bash
npm i @one-platform/opc-base # core component
npm i @one-platform/opc-nav # nav-bar component
npm i @one-platform/opc-menu-drawer # application drawer component
npm i @one-platform/opc-notification-drawer # notification drawer component
npm i @one-platform/opc-feedback # feedback button
```

2. Import the modules in your root js file.

```js
import opcBase from "@one-platform/opc-base";
import "@one-platform/opc-base/dist/opc-provider";
import "@one-platform/opc-nav/dist/opc-nav";
import "@one-platform/opc-menu-drawer/dist/opc-menu-drawer";
import "@one-platform/opc-notification-drawer/dist/opc-notification-drawer";
import "@one-platform/opc-feedback/dist/opc-feedback";

opcBase.configure({
  apiBasePath: "<api base for fetching app list>",
  subscriptionsPath: "<subscriptions base url for notifications>",
  keycloakUrl: "<keycloak url>",
  keycloakClientId: "<keycloak client id>",
  keycloakRealm: "<keycloak clock realm>",
});
```

## Themes

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
