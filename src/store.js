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
    tests,
    step,
    getAndDeleteObj,
    postAndPutObj,
    localObj,
    checkObj,
    projectName: '',
    projects: []
  },
  mutations: {
    testsUpdated(state, tests) {
      state.tests = tests;
    },
    SET_PROJECT_NAME(state, projectName){
      state.projectName = projectName;
    },
    SET_PROJECTS(state, projects){
      state.projects = projects;
    }
  },
  actions: {
    getProjects(context){
      Axios.get("/api/projects")
      .then((res)=> {
        context.commit("SET_PROJECTS",res.data);
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  getters: {
  }
});