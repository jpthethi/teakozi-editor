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
              ul.navbar-nav
                li.nav-item
                  router-link.nav-link.mr-2(:to="'/edit'+$route.path" title="Edit File")
                    i.material-icons(style="font-size: 1.5em;") edit
          tbody
            tr
              td
                pre(v-highlightjs="code")
                  code.javascript
</template>

<script>
import Axios from "axios";
import "highlight.js/styles/a11y-light.css";
export default {
  data() {
    return {
      isPathAFile: false,
      code: ""
    };
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
    Axios.get("/api" + this.$route.path)
      .then(res => {
        this.isPathAFile = res.data.isPathAFile;
        let contents = res.data.contents;
        if (!this.isPathAFile) {
          this.$store.commit("SET_CONTENTS", contents);
          this.$store.commit("SET_IS_FILE_MODE", false);
        } else {
          this.code = contents;
          this.$store.commit("SET_IS_FILE_MODE", true);
        }
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  },
  methods: {}
};
</script>

<style lang="scss">
</style>
