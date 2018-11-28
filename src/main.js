import Vue from 'vue';
import _ from 'lodash';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueHighlightJS from 'vue-highlightjs';

Vue.use(VueHighlightJS);

Object.defineProperty(Vue.prototype, "$_", {
  value: _
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');