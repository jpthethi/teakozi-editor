import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Tests from './components/Tests.vue';
import Project from './components/Project.vue';
import LogProvider from './components/LogProvider.vue';
import LogReport from './components/LogReport.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: "/",
    component: Home
  }, {
    path: "/tests",
    component: Tests
  }, {
    path: "/:projectName1",
    component: Project,
    props: true
  }, {
    path: "/logview",
    component: LogProvider,
  }, {
    path: "/logreport",
    name: "logreport",
    component: LogReport,
    props: true
  }]
});