import Vue from 'vue';
import Vuex from 'vuex';
import Axios from 'axios';

Vue.use(Vuex);
var getAndDeleteObj = {
  url: "", //required to all
  //headers: {} // optional to all
};

var postAndPutObj = {
  url: "", //required to all
  //json: "", //optional to post, not to get
  //file: "", //optional to post, not to get
  //override: {}, // optional to post, not to get
  //headers: {} // optional to all
};

var localObj = {
  file: ""
};

var checkObj = {
  //all are optional
  status: 200,
  //schema: "",
  //body: {
  //eq: {},
  //neq: {},
  //null: [],
  //deepEqual: {},
  //regex: {}
  //}
};

var step = {
  type: "get", // added for convienience
  get: getAndDeleteObj, //required
  name: "", // required
  //delay: "", //needs to be string
  //print: [], //optional
  check: checkObj, //required
  //collect: {}, //optional
  //skip_on_error: true //optional
  //iterate: "" //optional
};

var tests = {
  name: "",
  //tags: "",
  //iterate: "",
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
    projectDirs: []
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
      console.log("Given Path :::: ", path);
      state.paths = [];
      let paths = path.split("/");
      //paths.shift();
      console.log("paths :::: ", JSON.stringify(paths));
      paths.filter((ele, ind) => {
        let path1 = paths.slice(0, ind+1).join("/");
        state.paths.push({
          name: ele,
          path: path1
        });
      });
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
      Axios.get("/api/" + context.state.projectName)
        .then(res => {
          context.state.projectDirs = res.data;
        })
        .catch(err => {
          console.log("Error is :::: ", err);
        });
    }
  },
  getters: {}
});