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
                    a.nav-link.mr-2(href="" title="Iterate" @click.prevent="" :class="tests.iterate != undefined?'text-info':''")
                      i.material-icons(style="font-size:1.5em;") loop
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Tags" @click.prevent="" :class="tests.tags != undefined?'text-info':''")
                      i.material-icons(style="font-size:1.5em;") local_offer
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Run Current Test File" @click.prevent="runTests()")
                      i.material-icons(style="font-size:1.5em;") play_arrow
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Download YML File" @click.prevent="downloadYAML()")
                      i.material-icons(style="font-size:1.5em;") file_download
            .card-body
              .form-group.row
                label.col-sm-2.col-form-label(for='') Name
                label.col-sm-10.col-form-label(for='') {{tests.name}}
              template(v-if="tests.tags != undefined")
                .form-group.row
                  label.col-sm-2.col-form-label(for='') Tags
                  label.col-sm-10.col-form-label(for='') {{tests.tags}}
              template(v-if="tests.iterate != undefined")
                .form-group.row
                  label.col-sm-2.col-form-label(for='') Iterate
                  label.col-sm-10.col-form-label(for='') {{tests.iterate}}
              .form-group.row
                label.col-2.col-form-label(for='') Steps
                .col-10
                  template(v-for='(step, stepIndex) in tests.steps')
                    app-step.mb-5(v-bind:step='step' v-bind:step-index="stepIndex" v-bind:tests="tests" @stepUpdated="stepUpdated")
</template>

<script>
import Step from "./Step.vue";
import Store from "../store.js";
import Axios from "axios";
import FileSaver from "file-saver";

var tests;
const YAML = require("js-yaml");

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
    } else {
      console.log("inside mounted else");
    }
  },
  updated() {},
  methods: {
    downloadYAML() {
      let yamlTests = _.cloneDeep(this.tests);
      yamlTests.steps.filter(step => {
        delete step.type;
        return true;
      });
      let yamlStr = YAML.safeDump(yamlTests);
      const blob = new Blob([yamlStr], { type: "text/plain;charset=urf-8" });
      FileSaver.saveAs(blob, "test.yml");
    },
    stepUpdated(stepObj) {
      this.tests.steps[stepObj[0]] = stepObj[1];
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
      Axios.post(
        this.$router.options.base +
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
          if (res.data.err == undefined) {
            this.$router.push({
              name: "logreport",
              params: { log: res.data.testResponse }
            });
          }
        })
        .catch(err => {
          console.log("Error : ", err);
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
