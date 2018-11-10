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
            app-step(v-bind:step='step' v-bind:step-index="stepIndex" v-bind:tests="tests" @stepUpdated="stepUpdated")
            hr
          .form-group.row.mt-2
            .col-12
              a(href='', @click.prevent='addStep()', title='Add Step')
                i.fa.fa-plus-square-o.fa-lg
</template>

<script>
import Step from "./Step.vue";
import Store from "../store.js";
var tests;
var step = Store.state.step;
var getAndDeleteObj = Store.state.getAndDeleteObj;
var postAndPutObj = Store.state.postAndPutObj;
var localObj = Store.state.localObj;
var checkObj = Store.state.checkObj;

const YAML = require("js-yaml");
//const JP = require("jsonpath");

export default {
  components: {
    "app-step": Step
  },
  data: function() {
    return {
      tests: Store.state.tests,
      step: Store.state.step
    };
  },
  updated() {
    console.log("steps :::: ", JSON.stringify(this.tests));
  },
  methods: {
    addStep() {
      console.log("============  ", JSON.stringify(this.step));
      this.tests.steps.push(_.cloneDeep(this.step));
    },
    stepUpdated(stepObj) {
      this.tests.steps[stepObj[0]] = stepObj[1];
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
      for (let step of steps) {
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
</script>

<style lang="scss">
red {
  color: red;
}
</style>
