<template lang="pug">
.container.mt-3
  .row
    .col-12
      .card
        .card-header
          form.form-inline.mb-2.pull-right
            .form-group
              input.form-control.mr-2(placeholder="Enter Project Name" v-model="pName")
              router-link.btn.btn-info.btn-md(:to="'/projects/'+pName"  :class="pName==''?'disabled':''") New Project
        .card-body.py-0
          table.table.table-hover
            tbody
              template(v-for="(name, ind) in projects")
                tr
                  td
                    i.material-icons(style="font-size: 1em;") assignment
                    router-link.ml-2(:to="'/projects/'+name") {{name}}
</template>

<script>
export default {
  data() {
    return {
      pName: ""
    };
  },
  computed: {
    projects() {
      return this.$store.state.projects;
    },
    newProjectName: {
      set(name) {
        this.pName;
      },
      get() {
        return this.pName;
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
