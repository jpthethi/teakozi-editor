<template lang="pug">
  .row
    .col-12
      table.table.table-hover.mb-0
        tbody
          tr(v-for="(dir, ind) in dirs")
            td
              h5
                router-link(:to="'/'+projectName+'/'+dir") {{dir}}
</template>

<script>
export default {
  computed: {
    projectName() {
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
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.dispatch("getProject");
  }
};
</script>

<style lang="scss">
</style>
