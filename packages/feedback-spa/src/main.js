import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import '@one-platform/opc-header/dist/opc-header'
import '@one-platform/opc-footer/dist/opc-footer'
import { createProvider } from './vue-apollo'
const jsonexport = require('jsonexport')

Vue.component('jsonexport', jsonexport)

Vue.config.productionTip = false
window.OpAuthHelper.onLogin(() => {
  new Vue({
    router,
    store,
    apolloProvider: createProvider(),
    render: h => h(App)
  }).$mount('#app')
})
