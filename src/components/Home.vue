<template lang="pug">
  .container.mt-3
    h1
      | Test File
    form
      .form-group.row
        .col-sm-8
          button.btn.btn-info(type='button', @click='getLog()') Get Log
        .col-sm-4
          input.form-control-file.btn.btn-info(type='file', @change='onFileUploaded')
      .form-group.row
        label.col-sm-2.col-form-label(for='') Name
        .col-sm-10
          input.form-control(type='text', v-model='tests.name', placeholder='Eg: Tetst 1')
      .form-group.row
        label.col-sm-2.col-form-label(for='') Tags
        .col-sm-10
          input.form-control(type='text', placeholder='Eg: github, need_local_server', v-model='tests.tags')
      .form-group.row
        label.col-sm-2.col-form-label(for='') Iterate
        .col-sm-10
          input.form-control(type='text', v-model='tests.iterate', placeholder='Eg: many_runs')
      .form-group.row
        label.col-2.col-form-label(for='') Steps
        .col-10
          template(v-for='(step, stepIndex) in tests.steps')
            step(v-bind:step='step' v-bind:stepIndex="stepIndex")

          //template(v-for='(step, stepIndex) in tests.steps')
            .form-group.row
              .col-12
                a.red.pull-right(href='', title='Remove Step', @click.prevent='removeStep(stepIndex)')
                  i.fa.fa-trash-o.fa-lg
            .form-group.row
              label.col-sm-2.col-form-label(for='') Name
              .col-sm-10
                input.form-control(type='text', v-model='step.name')
            .form-group.row
              .col-sm-2
                select.form-control(v-model='step.type', @change='stepTypeChanged(step, stepIndex)')
                  option(value='get') GET
                  option(value='post') POST
                  option(value='put') PUT
                  option(value='delete') DELETE
                  option(value='local') LOCAL
              .col-sm-10
                template(v-for='(stepTypeVal,stepTypeKey) in step[step.type]')
                  template(v-if="stepTypeKey == 'file'")
                    .form-group.row(:key='stepTypeKey')
                      label.col-sm-2.col-form-label(for='') {{stepTypeKey}}
                      .col-sm-10
                        input.form-control(v-model='step[step.type].file', @keydown='$forceUpdate()')
                  template(v-if="stepTypeKey == 'url'")
                    .form-group.row(:key='stepTypeKey')
                      label.col-sm-2.col-form-label(for='') {{stepTypeKey}}
                      .col-sm-10
                        input.form-control(v-model='step[step.type].url', @keydown='$forceUpdate()')
                  template(v-if="stepTypeKey == 'json'")
                    .form-group.row(:key='stepTypeKey')
                      label.col-2.col-form-label(for='') {{stepTypeKey}}
                      .col-10
                        input.form-control(v-model='step[step.type].json', @keydown='$forceUpdate()')
                  template(v-if="stepTypeKey =='headers'")
                    .form-group.row(:key='stepTypeKey')
                      label.col-2.col-form-label(for='') {{stepTypeKey}}
                      .col-10
                        template(v-for='(headerVal, headerKey ) in stepTypeVal')
                          .form-group.row(:key='headerKey')
                            .col-5
                              input.form-control(placeholder='Authorization', :value='headerKey', @focusout='addHeaderKey(step, stepIndex, $event.target.value)')
                            .col-5
                              input.form-control(placeholder='Basic ***', v-model='step[step.type].headers[headerKey]', @focusout='$forceUpdate()')
                            .col-2
                              a(href='', @click.prevent='removeHeader(step, stepIndex, headerKey)', title="Remove Header")
                                i.fa.fa-trash-o.fa-lg
                        a(href='', @click.prevent='addHeader(step, stepIndex)', title="Add Header")
                          i.fa.fa-plus-square-o.fa-lg
                  template(v-if="stepTypeKey == 'override'")
                    .form-group.row(:key='stepTypeKey')
                      label.col-2.col-form-label {{stepTypeKey}}
                      .col-10
                        template(v-for='(overrideVal, overrideKey) in stepTypeVal')
                          .form-group.row(:key='overrideKey')
                            .col-5
                              input.form-control(placeholder='$.body', :value='overrideKey', @focusout='addOverrideKey(step, stepIndex, $event.target.value)')
                            .col-5
                              input.form-control(placeholder='~comment_text~', v-model='step[step.type].override[overrideKey]', @focusout='$forceUpdate()')
                            .col-2
                              a(href='', @click.prevent='removeOverride(step, overrideKey)', title="Remove Header")
                                i.fa.fa-trash-o.fa-lg
                        a(href='', @click.prevent='addOverride(step, stepIndex)', title="Add Override")
                          i.fa.fa-plus-square-o.fa-lg
            .form-group.row
              label.col-2.col-form-label(for='') Delay
              .col-sm-10
                input.form-control(type='text', name='', v-model='step.delay')
            .form-group.row
              label.col-2.col-form-label(for='') Iterate
              .col-10
                input.form-control(type='text', name='', v-model='step.iterate')
            .form-group.row
              label.col-sm-2.col-form-label(for='', name='') Print
              .col-sm-10
                template(v-for='(print, printIndex) in step.print')
                  .form-group.row
                    .col-11
                      input.form-control(:value='print')
                    .col-1
                      a(href='', @click.prevent='removePrint(stepIndex, printIndex)', title="Remove Print")
                        i.fa.fa-trash-o.fa-lg
                a(href='', @click.prevent='addPrint(stepIndex)', title="Add Print Variables")
                  i.fa.fa-plus-square-o.fa-lg
            .form-group.row
              label.col-sm-2.col-form-label(for='', name='') Check
              .col-sm-10
                template(v-for='(checkVal, checkKey) in step.check')
                  template(v-if="checkKey == 'status'")
                    .form-group.row
                      label.col-sm-2.col-form-label(for='', name='') Status
                      .col-sm-10
                        input.form-control(type='text', name='', v-model='step.check.status')
                  template(v-if="checkKey == 'schema'")
                    .form-group.row
                      label.col-2.col-form-label(for='') Schema
                      .col-10
                        input.form-control(type='text', name='', v-model='step.check.schema')
                  template(v-if="checkKey == 'body'")
                    .form-group.row
                      label.col-2.col-form-label Body
                      .col-10
                        template(v-for='(checkBodyVal, checkBodyKey) in step.check.body')
                          template(v-if="checkBodyKey == 'eq'")
                            .form-group.row
                              label.col-2.col-form-label eq
                              .col-10
                                template(v-for='(checkBodyEqVal, checkBodyEqKey) in checkBodyVal')
                                  .form-group.row
                                    .col-5
                                      input.form-control(:value='checkBodyEqKey', @focusout='addEqualCheckKey(stepIndex, $event.target.value)')
                                    .col-5
                                      input.form-control(v-model='step.check.body.eq[checkBodyEqKey]', @focusout='$forceUpdate()')
                                    .col-2
                                      a(href='', @click.prevent='removeEqualCheck(stepIndex, checkBodyEqKey)', title="Remove Eq check")
                                        i.fa.fa-trash-o.fa-lg
                                a(href='', @click.prevent='addEqualCheck(stepIndex)', title="Add Equal Check")
                                  i.fa.fa-plus-square-o.fa-lg
                          template(v-if="checkBodyKey == 'neq'")
                            .form-group.row
                              label.col-2.col-form-label neq
                              .col-10
                                template(v-for='(checkBodyNeqVal, checkBodyNeqKey) in checkBodyVal')
                                  .form-group.row
                                    .col-5
                                      input.form-control(:value='checkBodyNeqKey', @focusout='addNequalCheckKey(stepIndex, $event.target.value)')
                                    .col-5
                                      input.form-control(v-model='step.check.body.neq[checkBodyNeqKey]', @focusout='$forceUpdate()')
                                    .col-2
                                      a(href='', @click.prevent='removeNequalCheck(stepIndex, checkBodyNeqKey)', title="Remove Neq Check")
                                        i.fa.fa-trash-o.fa-lg
                                a(href='', @click.prevent='addNequalCheck(stepIndex)', title="Add Neq Check")
                                  i.fa.fa-plus-square-o.fa-lg
                          template(v-if="checkBodyKey == 'null'")
                            .form-group.row
                              label.col-sm-2.col-form-label(for='', name='') null
                              .col-sm-10
                                template(v-for='(nullVal, nullIndex) in checkBodyVal')
                                  .form-group.row
                                    .col-10
                                      input.form-control(v-model='step.check.body.null[nullIndex]')
                                    .col-2
                                      a(href='', @click.prevent='removeNull(stepIndex, nullIndex)', title="Remove Null Check")
                                        i.fa.fa-trash-o.fa-lg
                                a(href='', @click.prevent='addNull(stepIndex)', title="Add Null Check")
                                  i.fa.fa-plus-square-o.fa-lg
                          template(v-if="checkBodyKey == 'deepEqual'")
                            .form-group.row
                              label.col-2.col-form-label deepEqual
                              .col-10
                                template(v-for='(checkBodyDeepEqVal, checkBodyDeepEqKey) in checkBodyVal')
                                  .form-group.row
                                    .col-5
                                      input.form-control(:value='checkBodyDeepEqKey', @focusout='addDeepEqCheckKey(stepIndex, $event.target.value)')
                                    .col-5
                                      input.form-control(v-model='step.check.body.deepEqual[checkBodyDeepEqKey]', @focusout='$forceUpdate()')
                                    .col-2
                                      a(href='', @click.prevent='removeDeepEqCheck(stepIndex, checkBodyDeepEqKey)', title="Remove Deep Equal Check")
                                        i.fa.fa-trash-o.fa-lg
                                a(href='', @click.prevent='addDeepEqCheck(stepIndex)', title="Add Deep Equal Check")
                                  i.fa.fa-plus-square-o.fa-lg
                          template(v-if="checkBodyKey == 'regex'")
                            .form-group.row
                              label.col-2.col-form-label regex
                              .col-10
                                template(v-for='(checkBodyRegexVal, checkBodyRegexKey) in checkBodyVal')
                                  .form-group.row
                                    .col-5
                                      input.form-control(:value='checkBodyRegexKey', @focusout='addRegexCheckKey(stepIndex, $event.target.value)')
                                    .col-5
                                      input.form-control(v-model='step.check.body.regex[checkBodyRegexKey]', @focusout='$forceUpdate()')
                                    .col-2
                                      a(href='', @click.prevent='removeRegexCheck(stepIndex, checkBodyRegexKey)', title="Remove Regex Check")
                                        i.fa.fa-trash-o.fa-lg
                                a(href='', @click.prevent='addRegexCheck(stepIndex)', title="Add Regex Check")
                                  i.fa.fa-plus-square-o.fa-lg
            .form-group.row
              label.col-2.col-form-label Collect
              .col-10
                template(v-for='(collectVal, collectKey) in step.collect')
                  .form-group.row
                    .col-5
                      input.form-control(:value='collectKey', @focusout='addCollectKey(step, stepIndex, $event.target.value)', placeholder='gist_id')
                    .col-5
                      input.form-control(v-model='step.collect[collectKey]', placeholder='$.id', @focusout='$forceUpdate()')
                    .col-2
                      a(href='', @click.prevent='removeCollect(step, stepIndex, collectKey)', title="Remove Collect")
                        i.fa.fa-trash-o.fa-lg
                a(href='', @click.prevent='addCollect(step, stepIndex)', title="Add Collect")
                  i.fa.fa-plus-square-o.fa-lg
            .form-group.row
              label.col-2.col-form-label Skip On Error
              .col-10
                select.form-control(v-model='step.skip_on_error')
                  option(value='true') TRUE
                  option(value='false') FALSE
            hr
          .form-group.row.mt-2
            .col-12
              a(href='', @click.prevent='addStep()', title='Add Step')
                i.fa.fa-plus-square-o.fa-lg
</template>

<script>
var tests;
var step;
var getAndDeleteObj;
var postAndPutObj;
var localObj;
var checkObj;
const YAML = require("js-yaml");
//const JP = require("jsonpath");
import Step from "./Step.vue";
export default {
  components: {
    step: Step
  },
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
  headers: {} // optional to all
};

postAndPutObj = {
  url: "", //required to all
  json: "", //optional to post, not to get
  file: "", //optional to post, not to get
  override: {}, // optional to post, not to get
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
    eq: {},
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
  print: [], //optional
  check: checkObj, //required
  collect: {}, //optional
  skip_on_error: true //optional
};
</script>

<style lang="scss">
red {
  color: red;
}
</style>
