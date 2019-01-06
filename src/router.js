import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import EditTests from './components/EditTests.vue';
import Project from './components/Project.vue';
import LogProvider from './components/LogProvider.vue';
import LogReport from './components/LogReport.vue';
import Content from './components/Content.vue';
import NotFound from './components/NotFound.vue';
import EditContent from './components/EditContent.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  //base: process.env.BASE_URL,
  base: "/teakozi",
  routes: [{
    path: "/",
    //component: Home
    redirect: "/projects/trial"
  }, {
    path: "/projects/:shortcode",
    name: "projectRouter",
    component: Home
  }, {
    path: "/projects/:shortcode/*",
    component: Project,
    children: [{
      path: '',
      component: Content,
    }]
  }, {
    path: "/edit/projects/:shortcode/*",
    component: Project,
    children: [{
      path: "",
      component: EditContent
    }]
  }, {
    path: "/logview",
    component: LogProvider,
  }, {
    path: "/logreport",
    name: "logreport",
    component: LogReport,
    props: true
  }, {
    path: "/tests",
    component: EditTests,
    name: "tests",
    props: true
  }, {
    path: "*",
    component: NotFound
  }]
});