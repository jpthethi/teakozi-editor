import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex);
var getAndDeleteObj = {
  url: "",
};

var postAndPutObj = {
  url: "",
};

var localObj = {
  file: ""
};

var checkObj = {
  status: 200,
};

var step = {
  type: "get",
  get: getAndDeleteObj,
  name: "",
  check: checkObj,
};

var tests = {
  name: "",
  steps: []
};
export default new Vuex.Store({
  state: {
    paths: [],
    tests,
    step,
    getAndDeleteObj,
    postAndPutObj,
    localObj,
    checkObj,
    projectName: '',
    projects: [],
    projectDirs: [],
    contents: [],
    isEditMode: false,
    isFileMode: false,
    editMode: 'raw',
    code: '',
    inTests: false,
    inLogs: false,
  },
  mutations: {
    testsUpdated(state, tests) {
      state.tests = tests;
    },
    SET_PROJECT_NAME(state, projectName) {
      state.projectName = projectName;
    },
    SET_PROJECTS(state, projects) {
      state.projects = projects;
    },
    SET_PATHS(state, path) {
      state.paths = [];
      let paths = (path.split("/projects/")[1]).split("/");
      paths.filter((ele, ind) => {
        let path1 = paths.slice(0, ind + 1).join("/");
        state.paths.push({
          name: ele,
          path: "/projects/" + path1
        });
      });

      if (paths[1] == 'tests') {
        state.inTests = true;
      } else if (paths[1] == 'logs') {
        state.inLogs = true;
      } else {
        state.inTests = false;
        state.inLogs = false;
      }
    },
    SET_CONTENTS(state, contents) {
      state.contents = contents;
    },
    PUSH_CONTENT(state, content) {
      state.contents.push(content);
    },
    SET_IS_EDIT_MODE(state, isEditMode) {
      state.isEditMode = isEditMode;
    },
    SET_IS_FILE_MODE(state, isFileMode) {
      state.isFileMode = isFileMode;
    },
    SET_EDIT_MODE(state, editMode) {
      state.editMode = editMode;
    },
    SET_CODE(state, code) {
      state.code = code;
    },
    SET_IN_TESTS(state, inTests) {
      state.inTests = inTests;
    },
    SET_TESTS(state, tests) {
      state.tests = tests;
    },
    SET_IN_LOGS(state, inLogs) {
      state.inLogs = inLogs;
    }
  },
  actions: {
    getProjects(context) {
      Axios.get("/api/projects")
        .then((res) => {
          context.commit("SET_PROJECTS", res.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getProject(context) {
      Axios.get("/api/projects/" + context.state.projectName)
        .then(res => {
          context.state.projectDirs = res.data;
        })
        .catch(err => {
          console.log("Error is :::: ", err);
        });
    },
  },
  getters: {}
});