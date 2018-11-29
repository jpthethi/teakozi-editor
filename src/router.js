import Vue from 'vue';
import Router from 'vue-router';
import Home from './components/Home.vue';
import Tests from './components/Tests.vue';
import Project from './components/Project.vue';
import LogProvider from './components/LogProvider.vue';
import LogReport from './components/LogReport.vue';
import ProjectDir from './components/ProjectDir.vue';
import ProjectDirList from './components/ProjectDirList.vue';
import ProjectFile from './components/ProjectFile.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: "/",
    component: Home
  }, {
    path: "/tests",
    component: Tests,
    name: "tests",
    props: true
  }, {
    path: "/projects/:projectName",
    component: Project,
    props: true,
    children: [{
      path: '',
      component: ProjectDirList,
      props: true
    }, {
      path: ':dir',
      component: ProjectDir,
      props: true,
    }, {
      path: ':dir/:file',
      component: ProjectFile
    }]
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