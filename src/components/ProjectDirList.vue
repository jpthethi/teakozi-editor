<template lang="pug">
  .row
    .col-12
      table.table.table-hover.mb-0
        tbody
          tr(v-for="(dir, ind) in dirs")
            td
              .form-group
                template(v-if="dir.isFile == false")
                  i.material-icons(style="font-size: 1em;") folder
                template(v-else)
                  i.material-icons(style="font-size: 1em;") file
                router-link.ml-2(:to="'/projects/'+projectName+'/'+dir.name") {{dir.name}}
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
