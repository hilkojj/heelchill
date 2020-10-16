import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import axios from "axios";
import './assets/styles/index.scss'
import Unicon from 'vue-unicons'
import { uniLayerGroup, uniCarWash } from 'vue-unicons/src/icons'

Unicon.add([uniLayerGroup, uniCarWash]);
Vue.use(Unicon);

const base = axios.create();

Vue.prototype.$http = base;
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
