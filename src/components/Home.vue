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
                  <button type="button" class="btn btn-warning btn-xs float-right" title="Remove Step" @click="removeStep(stepIndex)">-</button>
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
                      <div class="form-group row">
                        <label for="" class="col-sm-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-sm-10">
                          <input class="form-control" v-model="step[step.type].file" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey == 'url'">
                      <div class="form-group row">
                        <label for="" class="col-sm-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-sm-10">
                          <input class="form-control" v-model="step[step.type].url" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey == 'json'">
                      <div class="form-group row">
                        <label for="" class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <input class="form-control" v-model="step[step.type].json" @keydown="$forceUpdate()">
                        </div>
                      </div>
                    </template>
                    <template v-if="stepTypeKey =='headers'">
                      <div class="form-group row">
                        <label for="" class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <template v-for="(headerKey, headerVal) in stepTypeVal">
                            <div class="form-group row" :key="headerKey">
                              <div class="col-5">
                                <input class="form-control" placeholder="Authorization" :value="headerVal" @focusout="addHeaderKey(step, stepIndex, $event.target.value)">
                              </div>
                              <div class="col-5">
                                <input class="form-control" placeholder="Basic ***" :value="headerKey">
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
                      <div class="form-group row">
                        <label class="col-2 col-form-label">{{stepTypeKey}}</label>
                        <div class="col-10">
                          <template v-for="(overrideVal, overrideKey) in stepTypeVal">
                            <div class="form-group row">
                              <div class="col-5">
                                <input class="form-control" placeholder="$.body" :value="overrideKey">
                              </div>
                              <div class="col-5">
                                <input class="form-control" placeholder="~comment_text~" :value="overrideVal">
                              </div>
                              <div class="col-2">
                                <button type="button" class="btn btn-warning btn-xs pull-right" @click="removeOverride(step, overrideKey)" title="Remove Header">-</button>
                              </div>
                            </div>
                          </template>
                          <button type="button" title="Add Header" class="btn btn-primary btn-xs" @click="addOverride(step, stepIndex)">+</button>
                        </div>
                      </div>
                    </template>
                  </template>
                </div>
              </div>
              <template v-for="(stepVal, stepKey) in step">
                <template v-if="stepKey == 'name'">
                  <div class="form-group row">
                    <label for="" class="col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" v-model="step.name">
                    </div>
                  </div>
                </template>
                <template v-if="stepKey == 'delay'">
                  <div class="form-group row">
                    <label for="" class="col-2 col-form-label">Delay</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" name="" v-model="step.delay">
                    </div>
                  </div>
                </template>
                <template v-if="stepKey == 'iterate'">
                  <div class="form-group row">
                    <label for="" class="col-2 col-form-label">Iterate</label>
                    <div class="col-10">
                      <input type="text" class="form-control" name="" v-model="step.iterate">
                    </div>
                  </div>
                </template>
                <template v-if="stepKey == 'print'">
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
                </template>
                <template v-if="stepKey == 'check'">
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
                                          <input class="form-control" v-model="checkBodyEqKey">
                                        </div>
                                        <div class="col-5">
                                          <input class="form-control" v-model="step.check.body.eq[checkBodyEqKey]">
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
                                          <input class="form-control" v-model="checkBodyNeqKey">
                                        </div>
                                        <div class="col-5">
                                          <input class="form-control" v-model="step.check.body.eq[checkBodyNeqKey]">
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
                                          <input class="form-control" :value="nullVal">
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
                                          <input class="form-control" v-model="checkBodyDeepEqKey">
                                        </div>
                                        <div class="col-5">
                                          <input class="form-control" v-model="step.check.body.eq[checkBodyDeepEqKey]">
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
                                          <input class="form-control" v-model="checkBodyRegexKey">
                                        </div>
                                        <div class="col-5">
                                          <input class="form-control" v-model="step.check.body.eq[checkBodyRegexKey]">
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
                </template>
                <template v-if="stepKey == 'collect'">
                  <div class="form-group row">
                    <label class="col-2 col-form-label">Collect</label>
                    <div class="col-10">
                      <template v-for="(collectVal, collectKey) in step.collect">
                        <div class="form-group row">
                          <div class="col-5">
                            <input class="form-control" v-model="collectKey">
                          </div>
                          <div class="col-5">
                            <input class="form-control" v-model="step.collect[collectKey]">
                          </div>
                          <div class="col-2">
                            <button class="btn btn-warning pull-right" title="Remove Collect" type="button" @click="removeCollect(stepIndex, collectKey)">-</button>
                          </div>
                        </div>
                      </template>
                      <button class="btn btn-info" title="Add Collect" type="button" @click="addCollect(stepIndex)">+</button>
                    </div>
                  </div>
                </template>
                <template v-if="stepKey == 'skip_on_error'">
                  <div class="form-group row">
                    <label class="col-2 col-form-label">Skip On Error</label>
                    <div class="col-10">
                      <select v-model="step.skip_on_error" class="form-control">
                        <option value="true">TRUE</option>
                        <option value="false">FALSE</option>
                      </select>
                    </div>
                  </div>
                </template>
              </template>
              <hr>
            </template>
            <button type="button" class="btn btn-info btn-xs" title="Add Step" @click="addStep()">+</button>
          </div>
        </div>
      </form>
  </div>
</template>

<script>
var tests;
var getAndDeleteObj;
var postAndPutObj;
var localObj;
const YAML = require("js-yaml");
export default {
  data: function() {
    return {
      tests: tests
    };
  },
  updated() {
    //console.log("updated");
  },
  methods: {
    addStep() {
      this.tests.steps.push(step);
    },
    removeStep(stepIndex) {
      this.tests.steps.splice(stepIndex, 1);
    },
    stepTypeChanged(step, stepIndex) {
      if (step.type == "get" || step.type == "delete") this.tests.steps[stepIndex][step.type] = getAndDeleteObj;
      else if(step.type == "post" || step.type == "put") this.tests.steps[stepIndex][step.type] = postAndPutObj;
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
      if (key) {
        delete this.tests.steps[stepIndex][step.type].headers[""];
        this.tests.steps[stepIndex][step.type].headers[key] = "";
        console.log(
          "======== ",
          this.tests.steps[stepIndex][step.type].headers
        );
      }
    },
    addOverride(step, stepIndex) {
      if (this.tests.steps[stepIndex].override[""] == undefined) {
        this.tests.steps[stepIndex].override[""] = "";
        this.$forceUpdate();
      }
    },
    removeOverride(step, overrideKey) {
      delete step[step.type].override[overrideKey];
      this.$forceUpdate();
    },
    removePrint(stepIndex, printIndex) {
      this.tests.steps[stepIndex].print.splice(printIndex, 1);
    },
    addPrint(stepIndex) {
      this.tests.steps[stepIndex].print.push("");
    },
    addCollect(stepIndex) {
      if (this.tests.steps[stepIndex].collect[""] == undefined) {
        this.tests.steps[stepIndex].collect[""] = "";
        this.$forceUpdate();
      }
    },
    removeCollect(stepIndex, collectKey) {
      delete this.tests.steps[stepIndex].collect[collectKey];
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
    removeNull(stepIndex, nullIndex) {
      this.tests.steps[stepIndex].check.body.null.splice(nullIndex, 1);
    },
    addNull(stepIndex) {
      this.tests.steps[stepIndex].check.body.null.push("");
    },
    removeDeepEqCheck(stepIndex, checkBodyDeepEqKey) {
      delete this.tests.steps[stepIndex].check.body.deepEqual[
        checkBodyDeepEqKey
      ];
      this.$forceUpdate();
    },
    addDeepEqCheck(stepIndex) {
      if (this.tests.steps[stepIndex].check.body.deepEqual[""] == undefined) {
        this.tests.steps[stepIndex].check.body.deepEqual[""] = "";
        this.$forceUpdate();
      }
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
    onFileUploaded(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      if (files[0].name.indexOf(".yml") != -1) this.readFile(files[0]);
    },
    readFile(file) {
      let reader = new FileReader();
      reader.onload = event => {
        let tests = YAML.safeLoad(event.target.result);
        this.getValidDoc(tests);
        this.tests = tests;
      };
      reader.onerror = error => console.error(error);
      reader.readAsText(file);
    },
    getValidDoc(tests) {
      let steps = tests.steps;
      for (step of steps) {
        if (step.get != undefined) {
          step.type = "get";
          getAndDeleteObj = step.get;
        } else if (step.post != undefined) {
          step.type = "post";
          postAndPutObj = step.post;
        } else if (step.delete != undefined) {
          step.type = "delete";
          getAndDeleteObj = step.delete;
        } else if (step.put != undefined) {
          step.type = "put";
          postAndPutObj = step.put;
        } else if(step.local != undefined){
          step.type = "local";
        } else {
          //console.log("wrong YAML");
        }
      }
    },
    getLog(){
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
  url: "{{local_traffic_server}}/k.json", //required to all
  headers: {
    //{"Authorization": "Basic xxxx"},
  } // optional to all
};

postAndPutObj = {
  url: "{{local_traffic_server}}/postk.json", //required to all
  json: "", //optional to post, not to get
  file: "", //optional to post, not to get
  override: [
    //{"$.body": "~comment_text~"}
  ], // optional to post, not to get
  headers: {} // optional to all
};

localObj = {
  file: ""
}

var step = {
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
  check: {
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
  }, //required
  collect: {
    //"auth_key": "$.~key_name~",
    //"": ""
  }, //optional
  skip_on_error: true //optional
};
</script>

<style lang="css">
</style>
