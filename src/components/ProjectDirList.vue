<template lang="pug">
  .row
    .col-12
      table.table.table-hover.mb-0
        tbody
          tr(v-for="(dir, ind) in contents")
            td
              .form-group
                template(v-if="dir.isFile == false")
                  i.material-icons(style="font-size: 1em;") folder
                template(v-else)
                  i.material-icons(style="font-size: 1em;") file
                router-link.ml-2(:to="'/projects/'+projectName+'/'+dir.name") {{dir.name}}
</template>

<script>
import Axios from "axios";
export default {
  computed: {
    contents() {
      return this.$store.state.contents;
    },
    projectName() {
      return this.$store.state.projectName;
    },
    dirs() {
      return this.$store.state.projectDirs;
    }
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    //this.$store.dispatch("getProject");
    Axios.get("/api/projects/" + this.projectName)
      .then(res => {
        this.$store.commit("SET_CONTENTS", res.data);
      })
      .catch(err => {
        console.log("Error is :::: ", err);
      });
  }
};
</script>

<style lang="scss">
</style>
