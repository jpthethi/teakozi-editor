<template lang="pug">
  .row
    .col-6
      ul.list-group
        template(v-for="(dir, ind) in dirs")
          li.list-group-item
            h4
              router-link(:to="'/'+projectName+'/'+dir") {{dir}}
</template>

<script>
export default {
  computed: {
    projectName(){
      return this.$store.state.projectName;
    },
    projectNames() {
      return this.$store.state.projectNames;
    },
    dirs() {
      return this.$store.state.projectDirs;
    }
  },
  created() {
    console.log("inside ProjectDirList created function");
    this.$store.dispatch("getProject");
  }
};
</script>

<style lang="scss">
</style>
