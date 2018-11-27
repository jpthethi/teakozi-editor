<template lang="pug">
.container-fluid.mt-2
  h4 {{projectName}}
  ul.list-group
    template(v-for="(dir, ind) in dirs")
      li.list-group-item
        h4
          router-link(:to="'/'+projectName+'/dir'") {{dir}}
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
    }
  },
  created() {
    console.log("projectName ::::: ", this.projectName1);
    this.$store.commit("SET_PROJECT_NAME", this.projectName1);
    this.$store.dispatch("getProject");
  },
  methods: {}
};
</script>
<style lang="scss">
</style>
