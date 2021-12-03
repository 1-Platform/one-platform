import '@one-platform/opc-header/dist/opc-header'
import '@one-platform/opc-footer/dist/opc-footer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import jsonexport from 'jsonexport'
import Vue from 'vue'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import pkg from '../package.json'

Vue.component('jsonexport', jsonexport)

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: process.env.VUE_APP_SENTRY_DSN,
    release: `feedback-spa@${pkg.version}`,
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}

Vue.config.productionTip = false
window.OpAuthHelper.onLogin(() => {
  new Vue({
    router,
    store,
    apolloProvider: createProvider(),
    render: h => h(App)
  }).$mount('#app')
})
