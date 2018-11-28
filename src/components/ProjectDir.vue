<template lang="pug">
.row
  .col-6
    ul.list-group
      template(v-for="(subDir, ind) in subDirs")
        li.list-group-item
          h5
            router-link(:to="'/'+$route.params.projectName+'/'+$route.params.dir+'/'+subDir") {{subDir}}
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
    Axios.get("/api/" + this.projectName + "/" + this.$route.params.dir)
      .then(res => {
        console.log("Response :::: ", res);
        this.dirs = res.data;
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  },
};
</script>
<style lang="scss">
</style>
