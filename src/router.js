import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import LogProvider from './components/LogProvider.vue';
import LogReport from './components/LogReport.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: "/",
    component: Home
  },{
      path: "/logview",
      component: LogProvider,
  },{
    path: "/logreport",
    name: "logreport",
    component: LogReport,
    props: true
  }]
});
