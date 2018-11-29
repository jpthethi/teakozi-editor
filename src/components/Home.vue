<template lang="pug">
.container-fluid.mt-3.row
  .col-6
    form.form-inline.mb-2
      .form-group
        input.form-control.mr-2(placeholder="Enter Project Name" v-model="projectName")
        router-link.btn.btn-info.btn-md(:to="'/projects/'+projectName"  :class="projectName==''?'disabled':''") New Project
    ul.list-group
      template(v-for="(name, ind) in projects")
        li.list-group-item 
          h4
            router-link.mr-4(:to="'/projects/'+name") {{name}}
</template>

<script>
import Axios from "axios";
export default {
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    projectName: {
      set(name) {
        this.$store.commit("SET_PROJECT_NAME", name);
      },
      get() {
        return this.$store.state.projectName;
      }
    }
  },
  beforeMount() {
    this.$store.dispatch("getProjects");
  }
};
</script>

<style lang="scss">
</style>
