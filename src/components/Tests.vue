<template lang="pug">
  .container.mt-3
    form
      .form-group.row
        .col-12
          .card
            .card-header
              nav.navbar.navbar-expand-md.navbar-light.bg-light.pull-right
                ul.navbar-nav
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Iterate" @click.prevent="addIterate2Tests()" :class="tests.iterate != undefined?'text-info':''")
                      i.material-icons(style="font-size:1.5em;") loop
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Tags" @click.prevent="addTags()" :class="tests.tags != undefined?'text-info':''")
                      i.material-icons(style="font-size:1.5em;") local_offer
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Run Test File" @click.prevent="runTests()")
                      i.material-icons(style="font-size:1.5em;") play_arrow
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Download YML File" @click.prevent="downloadYAML()")
                      i.material-icons(style="font-size:1.5em;") file_download
            .card-body
              .form-group.row
                label.col-sm-2.col-form-label(for='') Name
                .col-sm-10
                  input.form-control(type='text', v-model='tests.name', placeholder='Eg: Tetst 1')
              template(v-if="tests.tags != undefined")
                .form-group.row
                  label.col-sm-2.col-form-label(for='') Tags
                  .col-sm-10
                    input.form-control(type='text' placeholder='Eg: github, need_local_server' v-model='tests.tags' @focusout="$forceUpdate()")
              template(v-if="tests.iterate != undefined")
                .form-group.row
                  label.col-sm-2.col-form-label(for='') Iterate
                  .col-sm-10
                    input.form-control(type='text' v-model='tests.iterate' placeholder='Eg: many_runs' @focusout="$forceUpdate()")
              .form-group.row
                label.col-2.col-form-label(for='') Steps
                .col-10
                  template(v-for='(step, stepIndex) in tests.steps')
                    app-step.mb-5(v-bind:step='step' v-bind:step-index="stepIndex" v-bind:tests="tests" @stepUpdated="stepUpdated")
                  .form-group.row.mt-2
                    .col-12
                      a(href='', @click.prevent='addStep()', title='Add Step')
                        i.material-icons(style="font-size:1.5em;") library_add
</template>

<script>
import Step from "./Step.vue";
import Store from "../store.js";
import Axios from "axios";
import FileSaver from "file-saver";

var tests;
var step = Store.state.step;
var getAndDeleteObj = Store.state.getAndDeleteObj;
var postAndPutObj = Store.state.postAndPutObj;
var localObj = Store.state.localObj;
var checkObj = Store.state.checkObj;

const YAML = require("js-yaml");
//const JP = require("jsonpath");

export default {
  props: ["ymlPath"],
  components: {
    "app-step": Step
  },
  data: function() {
    return {
      projectName: "",
      tests: Store.state.tests,
      step: Store.state.step
    };
  },
  mounted() {
    if (this.$store.state.code) {
      let doc = YAML.safeLoad(this.$store.state.code);
      doc = this.getValidDoc(doc);
      this.tests = doc;
    }
    // if (this.ymlPath) {
    //   console.log("YamlPath is :::: ", this.ymlPath);
    //   Axios.get("/api/tests?yamlPath=" + this.ymlPath)
    //     .then(res => {
    //       console.log("Response is after mounted :::: ", JSON.stringify(res.data))
    //       let doc = YAML.safeLoad(res.data);
    //       doc = this.getValidDoc(doc);
    //       this.tests = doc;
    //     })
    //     .catch(err => {
    //       console.log("Error : ", err);
    //     });
    // }
  },
  updated() {
    console.log("latest tests :::: ", JSON.stringify(this.tests));
  },
  methods: {
    downloadYAML(e) {
      let yamlTests = _.cloneDeep(this.tests);
      yamlTests.steps.filter(step => {
        delete step.type;
        return true;
      });
      let yamlStr = YAML.safeDump(yamlTests);
      const blob = new Blob([yamlStr], { type: "text/plain;charset=urf-8" });
      FileSaver.saveAs(blob, "test.yml");
    },
    addTags() {
      if (this.tests.tags == undefined) {
        this.tests.tags = "";
      } else {
        delete this.tests.tags;
      }
      this.$forceUpdate();
    },
    addIterate2Tests() {
      if (this.tests.iterate == undefined) {
        this.tests.iterate = "";
      } else {
        delete this.tests.iterate;
      }
      this.$forceUpdate();
    },
    addStep() {
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
          console.log("wrong YAML");
        }
      }
      return tests;
    },
    runTests() {
      let yamlTests = _.cloneDeep(this.tests);
      yamlTests.steps.filter(step => {
        delete step.type;
        return true;
      });
      let yamlStr = YAML.safeDump(yamlTests);
      console.log("yamlStr ::::: ", yamlStr);
      console.log("Project Name ::::: ", this.$store.state.projectName);
      console.log("this.tests.tags  :::: ", this.tests.tags);
      Axios.post(
        "/api/run_tests?tags=" +
          this.tests.tags +
          "&path=" +
          this.$route.path.split("/edit")[1] +
          "&projectName=" +
          this.$store.state.projectName,
        { yaml: yamlStr }
      )
        .then(res => {
          console.log("Response :::: ", JSON.stringify(res.data));
        })
        .catch(err => {
          console.log("Error : ", err);
        });
    },
    getLog() {
      let yamlTests = _.cloneDeep(this.tests);
      delete yamlTests.iterate;
      yamlTests.steps.filter(step => {
        delete step.type;
        delete step.iterate;
        return true;
      });
      let yamlStr = YAML.safeDump(yamlTests);
      console.log("Sending this.tests are :::: ", JSON.stringify(yamlTests));
      console.log(yamlStr);

      Axios.post("/api/getLog", { yaml: yamlStr })
        .then(res => {
          console.log("response ::::: ", res);
          console.log("log report is ::::: ", res);
          this.$router.push({
            name: "logreport",
            params: { log: res.data.testResponse }
          });
        })
        .catch(err => {
          console.log("Error ::: ", err);
        });
    }
  }
};
</script>

<style lang="scss">
.red {
  color: red;
}

.delete-project {
  opacity: 0;
}

.delete-project:hover {
  color: red;
}

.project-row:hover .delete-project {
  opacity: 1;
}
//@import "../../node_modules/bootstrap/scss/_variables";
$theme-colors: (
  "primary": #d95700
);
//@import "../../node_modules/bootstrap/scss/bootstrap";
</style>
