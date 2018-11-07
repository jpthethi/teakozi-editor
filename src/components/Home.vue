<template lang="html">
  <div class="container mt-3">
      <h1>
        Test File
      </h1>
      <form>
        <div class="form-group row">
          <div class="col-sm-8">
            <button type="button" @click="getLog()" class="btn btn-info">Get Log</button>
          </div>
          <div class="col-sm-4">
            <input type="file" class="form-control-file btn btn-info" @change="onFileUploaded">
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label">Name</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="tests.name" placeholder="Eg: Tetst 1">
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label">Tags</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="Eg: github, need_local_server" v-model="tests.tags">
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-sm-2 col-form-label">Iterate</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="tests.iterate" placeholder="Eg: many_runs">
          </div>
        </div>
        <div class="form-group row">
          <label for="" class="col-2 col-form-label">Steps</label>
          <div class="col-10">
            <template v-for="(step, stepIndex) in tests.steps">
              <div class="form-group row">
                <div class="col-12">
                  <a href="" class="red pull-right" title="Remove Step" @click.prevent="removeStep(stepIndex)">
                    <i class="fa fa-trash-o fa-lg"></i>
                  </a>
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" v-model="step.name">
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-2">
                  <select class="form-control" v-model="step.type" @change="stepTypeChanged(step, stepIndex)">
                    <option value="get">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                    <option value="local">LOCAL</option>
                  </select>
                </div>
                <div class="col-sm-10">
                  <template v-for="(stepTypeVal,stepTypeKey) in step[step.type]">
                    <template v-if="stepTypeKey == 'file'">
                      <div class="form-group row" :key="stepTypeKey">
                        <label for="" class="col-sm-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-sm-10">
                          <input class="form-control" v-model="step[step.type].file" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey == 'url'">
                      <div class="form-group row" :key="stepTypeKey">
                        <label for="" class="col-sm-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-sm-10">
                          <input class="form-control" v-model="step[step.type].url" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey == 'json'">
                      <div class="form-group row" :key="stepTypeKey">
                        <label for="" class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <input class="form-control" v-model="step[step.type].json" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey =='headers'">
                      <div class="form-group row" :key="stepTypeKey">
                        <label for="" class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <template v-for="(headerVal, headerKey ) in stepTypeVal">
                            <div class="form-group row" :key="headerKey">
                              <div class="col-5">
                                <input class="form-control" placeholder="Authorization" :value="headerKey" @focusout="addHeaderKey(step, stepIndex, $event.target.value)">
                              </div>
                              <div class="col-5">
                                <input class="form-control" placeholder="Basic ***" v-model="step[step.type].headers[headerKey]" @focusout="$forceUpdate()">
                              </div>
                              <div class="col-2">
                                <button type="button" class="btn btn-warning btn-xs pull-right" @click="removeHeader(step, stepIndex, headerKey)" title="Remove Header">-</button>
                              </div>
                            </div>
                          </template>
                          <button type="button" title="Add Header" class="btn btn-info btn-xs" @click="addHeader(step, stepIndex)">+</button>
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey == 'override'">
                      <div class="form-group row" :key="stepTypeKey">
                        <label class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <template v-for="(overrideVal, overrideKey) in stepTypeVal">
                            <div class="form-group row" :key="overrideKey">
                              <div class="col-5">
                                <input class="form-control" placeholder="$.body" :value="overrideKey" @focusout="addOverrideKey(step, stepIndex, $event.target.value)">
                              </div>
                              <div class="col-5">
                                <input class="form-control" placeholder="~comment_text~" v-model="step[step.type].override[overrideKey]" @focusout="$forceUpdate()">
                              </div>
                              <div class="col-2">
                                <button type="button" class="btn btn-warning btn-xs pull-right" @click="removeOverride(step, overrideKey)" title="Remove Header">-</button>
                              </div>
                            </div>
                          </template>
                          <button type="button" title="Add Header" class="btn btn-info btn-xs" @click="addOverride(step, stepIndex)">+</button>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-2 col-form-label">Delay</label>
                <div class="col-sm-10">
                  <input type="text" class="form-control" name="" v-model="step.delay">
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-2 col-form-label">Iterate</label>
                <div class="col-10">
                  <input type="text" class="form-control" name="" v-model="step.iterate">
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-sm-2 col-form-label" name="">Print</label>
                <div class="col-sm-10">
                  <template v-for="(print, printIndex) in step.print">
                    <div class="form-group row">
                      <div class="col-11">
                        <input class="form-control" :value="print">
                      </div>
                      <div class="col-1">
                        <button type="button" class="btn btn-warning" @click="removePrint(stepIndex, printIndex)">-</button>
                      </div>
                    </div>
                  </template>
                  <button type="button" class="btn btn-info" title="Add Print Variables" @click="addPrint(stepIndex)">+</button>
                </div>
              </div>
              <div class="form-group row">
                <label for="" class="col-sm-2 col-form-label" name="">Check</label>
                <div class="col-sm-10">
                  <template v-for="(checkVal, checkKey) in step.check">
                    <template v-if="checkKey == 'status'">
                      <div class="form-group row">
                          <label for="" class="col-sm-2 col-form-label" name="">Status</label>
                          <div class="col-sm-10">
                            <input type="text" class="form-control" name="" v-model="step.check.status">
                          </div>
                      </div>
                    </template>
                    <template v-if="checkKey == 'schema'">
                      <div class="form-group row">
                        <label for="" class="col-2 col-form-label">Schema</label>
                        <div class="col-10">
                          <input type="text" class="form-control" name="" v-model="step.check.schema">
                        </div>
                      </div>
                    </template>
                    <template v-if="checkKey == 'body'">
                      <div class="form-group row">
                        <label class="col-2 col-form-label">Body</label>
                        <div class="col-10">
                          <template v-for="(checkBodyVal, checkBodyKey) in step.check.body">
                            <template v-if="checkBodyKey == 'eq'">
                              <div class="form-group row">
                                <label class="col-2 col-form-label">eq</label>
                                <div class="col-10">
                                  <template v-for="(checkBodyEqVal, checkBodyEqKey) in checkBodyVal">
                                    <div class="form-group row">
                                      <div class="col-5">
                                        <input class="form-control" :value="checkBodyEqKey" @focusout="addEqualCheckKey(stepIndex, $event.target.value)">
                                      </div>
                                      <div class="col-5">
                                        <input class="form-control" v-model="step.check.body.eq[checkBodyEqKey]" @focusout="$forceUpdate()">
                                      </div>
                                      <div class="col-2">
                                        <button class="btn btn-warning pull-right" title="Remove Eq check" type="button" @click="removeEqualCheck(stepIndex, checkBodyEqKey)">-</button>
                                      </div>
                                    </div>
                                  </template>
                                  <button class="btn btn-info btn-xs" type="button" title="Add Equal Check" @click="addEqualCheck(stepIndex)">+</button>
                                </div>
                              </div>
                            </template>
                            <template v-if="checkBodyKey == 'neq'">
                              <div class="form-group row">
                                <label class="col-2 col-form-label">neq</label>
                                <div class="col-10">
                                  <template v-for="(checkBodyNeqVal, checkBodyNeqKey) in checkBodyVal">
                                    <div class="form-group row">
                                      <div class="col-5">
                                        <input class="form-control" :value="checkBodyNeqKey" @focusout="addNequalCheckKey(stepIndex, $event.target.value)">
                                      </div>
                                      <div class="col-5">
                                        <input class="form-control" v-model="step.check.body.neq[checkBodyNeqKey]" @focusout="$forceUpdate()">
                                      </div>
                                      <div class="col-2">
                                        <button class="btn btn-warning pull-right" title="Remove Neq Check" type="button" @click="removeNequalCheck(stepIndex, checkBodyNeqKey)">-</button>
                                      </div>
                                    </div>
                                  </template>
                                  <button class="btn btn-info btn-xs" type="button" title="Add Neq Check" @click="addNequalCheck(stepIndex)">+</button>
                                </div>
                              </div>
                            </template>
                            <template v-if="checkBodyKey == 'null'">
                              <div class="form-group row">
                                <label for="" class="col-sm-2 col-form-label" name="">null</label>
                                <div class="col-sm-10">
                                  <template v-for="(nullVal, nullIndex) in checkBodyVal">
                                    <div class="form-group row">
                                      <div class="col-10">
                                        <input class="form-control" v-model="step.check.body.null[nullIndex]">
                                      </div>
                                      <div class="col-2">
                                        <button type="button" class="btn btn-warning pull-right" @click="removeNull(stepIndex, nullIndex)">-</button>
                                      </div>
                                    </div>
                                  </template>
                                <button class="btn btn-info btn-xs" type="button" title="Add Null Check" @click="addNull(stepIndex)">+</button>
                                </div>
                              </div>
                            </template>
                            <template v-if="checkBodyKey == 'deepEqual'">
                              <div class="form-group row">
                                <label class="col-2 col-form-label">deepEqual</label>
                                <div class="col-10">
                                  <template v-for="(checkBodyDeepEqVal, checkBodyDeepEqKey) in checkBodyVal">
                                    <div class="form-group row">
                                      <div class="col-5">
                                        <input class="form-control" :value="checkBodyDeepEqKey" @focusout="addDeepEqCheckKey(stepIndex, $event.target.value)">
                                      </div>
                                      <div class="col-5">
                                        <input class="form-control" v-model="step.check.body.deepEqual[checkBodyDeepEqKey]" @focusout="$forceUpdate()">
                                      </div>
                                      <div class="col-2">
                                        <button class="btn btn-warning pull-right" title="Remove Deep Equal Check" type="button" @click="removeDeepEqCheck(stepIndex, checkBodyDeepEqKey)">-</button>
                                      </div>
                                    </div>
                                  </template>
                                  <button class="btn btn-info btn-xs" type="button" title="Add Deep Equal Check" @click="addDeepEqCheck(stepIndex)">+</button>
                                </div>
                              </div>
                            </template>
                            <template v-if="checkBodyKey == 'regex'">
                              <div class="form-group row">
                                <label class="col-2 col-form-label">regex</label>
                                <div class="col-10">
                                  <template v-for="(checkBodyRegexVal, checkBodyRegexKey) in checkBodyVal">
                                    <div class="form-group row">
                                      <div class="col-5">
                                        <input class="form-control" :value="checkBodyRegexKey" @focusout="addRegexCheckKey(stepIndex, $event.target.value)">
                                      </div>
                                      <div class="col-5">
                                        <input class="form-control" v-model="step.check.body.regex[checkBodyRegexKey]" @focusout="$forceUpdate()">
                                      </div>
                                      <div class="col-2">
                                        <button class="btn btn-warning pull-right" title="Remove Regex Check" type="button" @click="removeRegexCheck(stepIndex, checkBodyRegexKey)">-</button>
                                      </div>
                                    </div>
                                  </template>
                                  <button class="btn btn-info btn-xs" type="button" title="Add Regex Check" @click="addRegexCheck(stepIndex)">+</button>
                                </div>
                              </div>
                            </template>
                          </template>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-2 col-form-label">Collect</label>
                <div class="col-10">
                  <template v-for="(collectVal, collectKey) in step.collect">
                    <div class="form-group row">
                      <div class="col-5">
                        <input class="form-control" :value="collectKey" @focusout="addCollectKey(step, stepIndex, $event.target.value)" placeholder="gist_id">
                      </div>
                      <div class="col-5">
                        <input class="form-control" v-model="step.collect[collectKey]" placeholder="$.id" @focusout="$forceUpdate()">
                      </div>
                      <div class="col-2">
                        <button class="btn btn-warning pull-right" title="Remove Collect" type="button" @click="removeCollect(step, stepIndex, collectKey)">-</button>
                      </div>
                    </div>
                  </template>
                  <button class="btn btn-info" title="Add Collect" type="button" @click="addCollect(step, stepIndex)">+</button>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-2 col-form-label">Skip On Error</label>
                <div class="col-10">
                  <select v-model="step.skip_on_error" class="form-control">
                    <option value="true">TRUE</option>
                    <option value="false">FALSE</option>
                  </select>
                </div>
              </div>
              <hr>
            </template>
            <div class="form-group row mt-2">
              <div class="col-12">
              <a href="" @click.prevent="addStep()" title="Add Step">
                <i class="fa fa-plus-square-o fa-lg"></i>
              </a>
              </div>
            </div>
          </div>
        </div>
      </form>
  </div>
</template>

<script>
var tests;
var step;
var getAndDeleteObj;
var postAndPutObj;
var localObj;
var checkObj;
const YAML = require("js-yaml");
const JP = require("jsonpath");
export default {
  data: function() {
    return {
      tests: tests
    };
  },
  updated() {
    console.log("steps :::: ", JSON.stringify(this.tests.steps));
  },
  methods: {
    addStep() {
      this.tests.steps.push(step);
    },
    removeStep(stepIndex) {
      this.tests.steps.splice(stepIndex, 1);
    },
    stepTypeChanged(step, stepIndex) {
      delete this.tests.steps[stepIndex].get;
      delete this.tests.steps[stepIndex].post;
      delete this.tests.steps[stepIndex].put;
      delete this.tests.steps[stepIndex].delete;

      if (step.type == "get" || step.type == "delete")
        this.tests.steps[stepIndex][step.type] = getAndDeleteObj;
      else if (step.type == "post" || step.type == "put")
        this.tests.steps[stepIndex][step.type] = postAndPutObj;
      else this.tests.steps[stepIndex][step.type] = localObj;
    },
    addHeader(step, stepIndex) {
      if (this.tests.steps[stepIndex][step.type].headers[""] == undefined) {
        this.tests.steps[stepIndex][step.type].headers[""] = "";
        this.$forceUpdate();
      }
    },
    removeHeader(step, stepIndex, headerKey) {
      delete this.tests.steps[stepIndex][step.type].headers[headerKey];
      this.$forceUpdate();
    },
    addHeaderKey(step, stepIndex, key) {
      if (this.tests.steps[stepIndex][step.type].headers[key] == undefined) {
        delete this.tests.steps[stepIndex][step.type].headers[""];
        this.tests.steps[stepIndex][step.type].headers[key] = "";
      }
      this.$forceUpdate();
    },
    addOverride(step, stepIndex) {
      if (this.tests.steps[stepIndex][step.type].override[""] == undefined) {
        this.tests.steps[stepIndex][step.type].override[""] = "";
        this.$forceUpdate();
      }
    },
    removeOverride(step, overrideKey) {
      delete step[step.type].override[overrideKey];
      this.$forceUpdate();
    },
    addOverrideKey(step, stepIndex, key) {
      if (this.tests.steps[stepIndex][step.type].override[key] == undefined) {
        delete this.tests.steps[stepIndex][step.type].override[""];
        this.tests.steps[stepIndex][step.type].override[key] = "";
      }
      this.$forceUpdate();
    },
    removePrint(stepIndex, printIndex) {
      this.tests.steps[stepIndex].print.splice(printIndex, 1);
    },
    addPrint(stepIndex) {
      this.tests.steps[stepIndex].print.push("");
    },
    addCollect(step, stepIndex) {
      if (this.tests.steps[stepIndex].collect[""] == undefined) {
        this.tests.steps[stepIndex].collect[""] = "";
        this.$forceUpdate();
      }
    },
    removeCollect(step, stepIndex, collectKey) {
      delete this.tests.steps[stepIndex].collect[collectKey];
      this.$forceUpdate();
    },
    addCollectKey(step, stepIndex, key) {
      if (this.tests.steps[stepIndex].collect[key] == undefined) {
        delete this.tests.steps[stepIndex].collect[""];
        this.tests.steps[stepIndex].collect[key] = "";
      }
      this.$forceUpdate();
    },
    addEqualCheck(stepIndex) {
      if (this.tests.steps[stepIndex].check.body.eq[""] == undefined) {
        this.tests.steps[stepIndex].check.body.eq[""] = "";
        this.$forceUpdate();
      }
    },
    removeEqualCheck(stepIndex, checkBodyEqKey) {
      delete this.tests.steps[stepIndex].check.body.eq[checkBodyEqKey];
      this.$forceUpdate();
    },
    addEqualCheckKey(stepIndex, key) {
      if (this.tests.steps[stepIndex].check.body.eq[key] == undefined) {
        delete this.tests.steps[stepIndex].check.body.eq[""];
        this.tests.steps[stepIndex].check.body.eq[key] = "";
      }
      this.$forceUpdate();
    },
    addNequalCheck(stepIndex) {
      if (this.tests.steps[stepIndex].check.body.neq[""] == undefined) {
        this.tests.steps[stepIndex].check.body.neq[""] = "";
        this.$forceUpdate();
      }
    },
    removeNequalCheck(stepIndex, checkBodyNeqKey) {
      delete this.tests.steps[stepIndex].check.body.neq[checkBodyNeqKey];
      this.$forceUpdate();
    },
    addNequalCheckKey(stepIndex, key) {
      if (this.tests.steps[stepIndex].check.body.neq[key] == undefined) {
        delete this.tests.steps[stepIndex].check.body.neq[""];
        this.tests.steps[stepIndex].check.body.neq[key] = "";
      }
      this.$forceUpdate();
    },
    removeNull(stepIndex, nullIndex) {
      this.tests.steps[stepIndex].check.body.null.splice(nullIndex, 1);
    },
    addNull(stepIndex) {
      this.tests.steps[stepIndex].check.body.null.push("");
    },
    removeDeepEqCheck(stepIndex, key) {
      delete this.tests.steps[stepIndex].check.body.deepEqual[key];
      this.$forceUpdate();
    },
    addDeepEqCheck(stepIndex) {
      if (this.tests.steps[stepIndex].check.body.deepEqual[""] == undefined) {
        this.tests.steps[stepIndex].check.body.deepEqual[""] = "";
        this.$forceUpdate();
      }
    },
    addDeepEqCheckKey(stepIndex, key) {
      if (this.tests.steps[stepIndex].check.body.deepEqual[key] == undefined) {
        delete this.tests.steps[stepIndex].check.body.deepEqual[""];
        this.tests.steps[stepIndex].check.body.deepEqual[key] = "";
      }
      this.$forceUpdate();
    },
    removeRegexCheck(stepIndex, checkBodyRegexKey) {
      delete this.tests.steps[stepIndex].check.body.regex[checkBodyRegexKey];
      this.$forceUpdate();
    },
    addRegexCheck(stepIndex) {
      if (this.tests.steps[stepIndex].check.body.regex[""] == undefined) {
        this.tests.steps[stepIndex].check.body.regex[""] = "";
        this.$forceUpdate();
      }
    },
    addRegexCheckKey(stepIndex, key) {
      if (this.tests.steps[stepIndex].check.body.regex[key] == undefined) {
        delete this.tests.steps[stepIndex].check.body.regex[""];
        this.tests.steps[stepIndex].check.body.regex[key] = "";
      }
      this.$forceUpdate();
    },
    onFileUploaded(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (files[0].name.indexOf(".yml") != -1) this.readFile(files[0]);
    },
    readFile(file) {
      let reader = new FileReader();
      reader.onload = event => {
        let doc = YAML.safeLoad(event.target.result);
        doc = this.getValidDoc(doc);
        this.tests = doc;
      };
      reader.onerror = error => console.error(error);
      reader.readAsText(file);
    },
    getValidDoc(tests) {
      let steps = tests.steps;
      for (step of steps) {
        if (step.get != undefined) {
          step.type = "get";
        } else if (step.post != undefined) {
          step.type = "post";
        } else if (step.delete != undefined) {
          step.type = "delete";
        } else if (step.put != undefined) {
          step.type = "put";
        } else if (step.local != undefined) {
          step.type = "local";
        } else {
          //console.log("wrong YAML");
        }
        step = this.getValidStep(step);
        step[step.type] = this.getValidStepType(step.type, step[step.type]);
        step.check = this.getValidCheck(step.check);
        step.check.body = this.getValidCheckBody(step.check.body);
      }
      return tests;
    },
    getValidStep(stepObj) {
      let requiredKeys = Object.keys(step);
      for (var key of requiredKeys) {
        if (stepObj[key] == undefined) {
          stepObj[key] = step[key];
        }
      }
      return step;
    },
    getValidStepType(stepType, stepTypeObj) {
      if (["get", "delete"].includes(stepType)) {
        let requiredKeys = Object.keys(getAndDeleteObj);
        for (var key of requiredKeys) {
          if (stepTypeObj[key] == undefined) {
            stepTypeObj[key] = getAndDeleteObj[key];
          }
        }
      } else {
        let requiredKeys = Object.keys(postAndPutObj);
        for (var key in requiredKeys) {
          if (stepTypeObj[key] == undefined) {
            stepTypeObj[key] = postAndPutObj[key];
          }
        }
      }
      return stepTypeObj;
    },
    getValidCheck(stepCheckObj) {
      let requiredKeys = Object.keys(checkObj);
      for (var key of requiredKeys) {
        if (stepCheckObj[key] == undefined) {
          stepCheckObj[key] = checkObj[key];
        }
      }
      return stepCheckObj;
    },
    getValidCheckBody(stepCheckBodyObj) {
      let requiredKeys = Object.keys(checkObj.body);
      for (var key of requiredKeys) {
        if (stepCheckBodyObj[key] == undefined) {
          stepCheckBodyObj[key] = checkObj.body[key];
        }
      }
      return stepCheckBodyObj;
    },
    getLog() {
      //let yamlStr = YAML.safeDump(this.tests);
      //console.log(yamlStr);
    }
  }
};

tests = {
  name: "",
  tags: "",
  iterate: "many_runs",
  steps: []
};

getAndDeleteObj = {
  url: "", //required to all
  headers: {
    //{"Authorization": "Basic xxxx"},
  } // optional to all
};

postAndPutObj = {
  url: "", //required to all
  json: "", //optional to post, not to get
  file: "", //optional to post, not to get
  override: {
    //{"$.body": "~comment_text~"}
  }, // optional to post, not to get
  headers: {} // optional to all
};

localObj = {
  file: ""
};

checkObj = {
  //all are optional
  status: 0,
  schema: "",
  body: {
    eq: {
      //"$.length": 20,
      //"$..[0].name": ""
    },
    neq: {},
    null: [],
    deepEqual: {},
    regex: {}
  }
};

step = {
  type: "get", // added for convienience
  //"post": postAndPutObj,
  get: getAndDeleteObj, //required
  name: "Get Auth K", // required
  delay: "", //needs to be string
  iterate: "", //optional
  print: [
    //"status",
    //"$.~key_name~"
  ], //optional
  check: checkObj, //required
  collect: {
    //"auth_key": "$.~key_name~",
    //"": ""
  }, //optional
  skip_on_error: true //optional
};
</script>

<style lang="scss">
red {
  color: red;
}
</style>
