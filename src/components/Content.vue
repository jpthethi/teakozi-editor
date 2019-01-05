<template lang="pug">
  .row
    .col-12
      template(v-if="!isPathAFile")
        table.table.table-hover.mb-0
          tbody
            tr(v-for="(content, ind) in contents")
              td
                .form-group
                  template(v-if="content.isFile == false")
                    i.material-icons(style="font-size: 1em;") folder
                  template(v-else)
                    i.material-icons(style="font-size: 1em;") insert_drive_file
                  router-link.ml-2(:to="$route.path+'/'+content.name") {{content.name}}
      template(v-else)
        table.table.mb-0
          thead
            nav.navbar.navbar-expand-lg.navbar-light.bg-none.float-right.p-0
              template(v-if="!$store.state.inLogs")
                ul.navbar-nav
                  li.nav-item
                    a.nav-link.mr-2(href="" :to="$router.options.base+'/edit'+$route.path" title="Edit As Raw File" @click.prevent="$store.commit('SET_EDIT_MODE', 'raw');editFile();")
                      i.material-icons(style="font-size: 1.5em;") edit
                  li.nav-item
                    a.nav-link.mr-2(href="" :to="$router.options.base+'/edit'+$route.path" title="Run All Test Files" @click.prevent="runAllTests()")
                      i.material-icons(style="font-size: 1.5em;") play_circle_filled
              template(v-else)
                ul.navbar-nav
                  li.nav-item
                    a.nav-link(href="" id="exPopoverManual1" @click.prevent="showPopup=!showPopup;copyLog();" @blur="showPopup=false;")
                      i.material-icons(style="font-size: 1.5em;") file_copy
                    b-popover(target="exPopoverManual1" :show.sync="showPopup" triggers="click") Copied!
          tbody
            tr
              td
                template(v-if="$store.state.inTests")
                  tests(:ymlPath="$route.path.split('/edit/')[1]")
                template(v-else-if="$store.state.inLogs")
                  logReport(:rawLog="code")
                template(v-else)
                  pre(v-highlightjs="code")
                    code.javascript
</template>

<script>
import Axios from "axios";
import "highlight.js/styles/a11y-light.css";
import TestsVue from "./Tests";
import LogReport from "./LogReport";
export default {
  data() {
    return {
      showPopup: false,
      isPathAFile: false,
      code: ""
    };
  },
  components: {
    tests: TestsVue,
    logReport: LogReport
  },
  computed: {
    contents() {
      return this.$store.state.contents;
    },
    paths() {
      return this.$store.state.paths;
    }
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.commit("SET_PROJECT_NAME", this.$store.state.paths[0].name);
    Axios.get(this.$router.options.base + "/api" + this.$route.path)
      .then(res => {
        this.isPathAFile = res.data.isPathAFile;
        let contents = res.data.contents;
        if (!this.isPathAFile) {
          this.$store.commit("SET_CONTENTS", contents);
          this.$store.commit("SET_IS_FILE_MODE", false);
        } else {
          this.code = contents;
          this.$store.commit("SET_CODE", contents);
          this.$store.commit("SET_IS_FILE_MODE", true);
        }
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  },
  methods: {
    editFile() {
      this.$router.push({ path: "/edit" + this.$route.path });
    },
    copyLog(){
      this.$copyText(this.code)
      .then((e=>{
        console.log("Copied");
      }),(e=>{
        console.log("Didn't copied");
      }));
    },
    runAllTests() {
      Axios.get(
        this.$router.options.base +
          "/api/run_tests?projectName=" +
          this.$store.state.projectName
      )
        .then(res => {
          console.log("Response : ", JSON.stringify(res.data));
          if (res.data.log) {
            this.$router.push({
              name: "logreport",
              params: { log: res.data.log }
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
</style>
