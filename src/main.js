import Vue from 'vue';
import _ from 'lodash';
import App from './App.vue';
import router from './router';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import VueHighlightJS from 'vue-highlightjs';
import moment from 'moment';
import VueClipboard from 'vue-clipboard2';
import BootstrpVue from 'bootstrap-vue';

Vue.use(BootstrpVue);
Vue.use(VueHighlightJS);
Vue.use(VueClipboard);

Object.defineProperty(Vue.prototype, "$_", {
  value: _
});

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');