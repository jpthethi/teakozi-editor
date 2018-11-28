<template lang="pug">
.container-fluid.mt-2
  //h4
    router-link(:to="'/'+projectName") {{projectName}}
  .row
    .col-6
      nav
        ol.breadcrumb
          template(v-for="(path, ind) in paths")
            template(v-if="ind == paths.length-1")
              li.breadcrumb-item.active {{path.name}}
            template(v-else)
              li.breadcrumb-item
                router-link(:to="path.path") {{path.name}}
  router-view
</template>
<script>
import Axios from "axios";
export default {
  props: ["projectName1"],
  data() {
    return {};
  },
  computed: {
    projectName() {
      return this.$store.state.projectName;
    },
    dirs() {
      return this.$store.state.projectDirs;
    },
    paths() {
      return this.$store.state.paths;
    }
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.commit("SET_PROJECT_NAME", this.$route.params.projectName);
  },
  destroyed() {
    //this.$store.commit("POP_PATH", this.$route.path);
  },
  methods: {}
};
</script>
<style lang="scss">
</style>
