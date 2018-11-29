<template lang="pug">
  .row
    .col-12
      table.table.table-hover.mb-0
        tbody
          template(v-for="(subDir, ind) in subDirs")
            td
              .form-group
                template(v-if="subDir.isFile == false")
                  i.material-icons(style="font-size: 1em;") folder
                template(v-else)
                  i.material-icons.breadcru(style="font-size: 1em;") insert_drive_file
                template(v-if="subDir.ext == '.yml'")
                  router-link.ml-2(:to="{name: 'tests', params: {ymlPath: '/'+$route.params.projectName+'/'+$route.params.dir+'/'+subDir.name}}") {{subDir.name}}
                template(v-else)
                  router-link.ml-2(:to="'/projects/'+$route.params.projectName+'/'+$route.params.dir+'/'+subDir.name") {{subDir.name}}
</template>
<script>
import Axios from "axios";
export default {
  data() {
    return {
      dirs: []
    };
  },
  computed: {
    subDirs() {
      return this.dirs;
    },
    projectName() {
      return this.$store.state.projectName;
    }
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    Axios.get("/api/projects/" + this.projectName + "/" + this.$route.params.dir)
      .then(res => {
        this.dirs = res.data;
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  }
};
</script>
<style lang="scss">
</style>
