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
                  a.nav-link.mr-2(href="" :to="$router.options.base+'/edit'+$route.path" title="Edit As Raw File" @click.prevent="$store.commit('SET_EDIT_MODE', 'raw');editFile();")
                    i.material-icons(style="font-size: 1.5em;") edit
                li.nav-item
                  a.nav-link.mr-2(href="" :to="$router.options.base+'/edit'+$route.path" title="Edit in Teakozi Editor" @click.prevent="$store.commit('SET_EDIT_MODE', 'teditor');editFile();")
                    i.material-icons(style="font-size: 1.5em;") language
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
    }
  }
};
</script>

<style lang="scss">
</style>
