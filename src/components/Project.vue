<template lang="pug">
.container-fluid.mt-2
  h4
    router-link(:to="'/'+projectName") {{projectName}}
  //nav
    ol.breadcrumb
      template(v-for="(page, ind) in pages")
        template(v-if="ind == pages.length-1")
          li.breadcrumb-item.active {{page}}
        template(v-else)
          li.breadcrumb-item
            router-link(:to=""){{page}}
  //ul.list-group
    template(v-for="(dir, ind) in dirs")
      li.list-group-item
        h4
          router-link(:to="'/'+$route.params.projectName+'/dir'") {{dir}}
  router-view
</template>
<script>
import Axios from "axios";
export default {
  props: ["projectName1"],
  data() {
    return {
      paths: []
    };
  },
  computed: {
    projectName() {
      return this.$store.state.projectName;
    },
    dirs() {
      return this.$store.state.projectDirs;
    }
  },
  created() {
    this.paths=[];
    this.$store.commit("SET_PROJECT_NAME", this.$route.params.projectName);
    this.paths.push(this.projectName1);
  },
  methods: {}
};
</script>
<style lang="scss">
</style>
