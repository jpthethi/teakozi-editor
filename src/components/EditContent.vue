<template lang="pug">
  .row
    .col-12
      table.table.mb-0
        thead
          tr
            th
              nav.navbar.navbar-expand-lg.navbar-light.bg-none.float-right.p-0
                ul.navbar-nav
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Save File" @click.prevent="saveContent")
                      i.material-icons(style="font-size: 1.5em;") save
                  li.nav-item
                    router-link.nav-link.mr-2(:to="$route.path.split('/edit')[1]" title="Cancel")
                      i.material-icons(style="font-size: 1.5em;") cancel
        tbody
          tr
            td
              template(v-if="!$store.state.inTests")
                codemirror(ref="myCm" :value="code" :options="cmOptions" @input="onCmChange")
              template(v-else)
                edit-tests(:ymlPath="$route.path.split('/edit/')[1]" :key="edit_tests_key")
</template>

<script>
import Axios from "axios";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/base16-light.css";
import EditTestsVue from "./EditTests";

const YAML = require("js-yaml");
export default {
  data() {
    return {
      edit_tests_key: 0,
      code: "",
      cmOptions: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-light",
        lineNumbers: true,
        line: true
      }
    };
  },
  computed: {
    paths() {
      return this.$store.state.paths;
    },
    codemirror() {
      return this.$refs.myCm.codemirror;
    }
  },
  components: {
    codemirror,
    editTests: EditTestsVue
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.commit("SET_PROJECT_NAME", this.$store.state.paths[0].name);
    this.$store.commit("SET_IS_FILE_MODE", true);
    Axios.get(
      this.$router.options.base + "/api" + this.$route.path.split("/edit")[1]
    )
      .then(res => {
        this.$store.commit("SET_CODE", res.data.contents);
        this.code = this.$store.state.code;
        this.edit_tests_key = 1;
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  },
  destroyed() {
    this.$store.commit("SET_IS_FILE_MODE", false);
    this.$store.commit("SET_TESTS", {
      name: "",
      steps: []
    });
  },
  methods: {
    onCmChange(newCode) {
      this.code = newCode;
    },
    saveContent() {
      if (this.$store.state.inTests) {
        let yamlTests = _.cloneDeep(this.$store.state.tests);
        yamlTests.steps.filter(step => {
          delete step.type;
          return true;
        });
        let yamlStr = YAML.safeDump(yamlTests);
        this.code = yamlStr;
      }

      Axios.post(
        this.$router.options.base + "/api" + this.$route.path.split("/edit")[1],
        {
          code: this.code
        }
      )
        .then(res => {
          console.log("Response : ", JSON.stringify(res));
          this.$router.push({ path: this.$route.path.split("/edit")[1] });
        })
        .catch(err => {
          console.log("Error : ", err);
        });
    }
  }
};
</script>

