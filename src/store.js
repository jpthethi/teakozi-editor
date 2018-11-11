import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
var getAndDeleteObj = {
  url: "", //required to all
  headers: {} // optional to all
};

var postAndPutObj = {
  url: "", //required to all
  json: "", //optional to post, not to get
  file: "", //optional to post, not to get
  override: {}, // optional to post, not to get
  headers: {} // optional to all
};

var localObj = {
  file: ""
};

var checkObj = {
  //all are optional
  status: 0,
  schema: "",
  body: {
    eq: {},
    neq: {},
    null: [],
    deepEqual: {},
    regex: {}
  }
};

var step = {
  type: "get", // added for convienience
  //"post": postAndPutObj,
  get: getAndDeleteObj, //required
  name: "Get Auth K", // required
  delay: "", //needs to be string
  //iterate: "", //optional
  print: [], //optional
  check: checkObj, //required
  collect: {}, //optional
  skip_on_error: true //optional
};

var tests = {
  name: "",
  tags: "",
  iterate: "many_runs",
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
  },
  mutations: {
    testsUpdated(state, tests) {
      state.tests = tests;
    }
  },
  actions: {

  },
  getters: {

  }
});