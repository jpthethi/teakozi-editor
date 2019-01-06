<template lang="pug">
.container.mt-3
  .row
    .col-12
      .card
        .card-header
          form.form-inline.mb-2.pull-right(@submit.prevent="getProject")
            .form-group
              input.form-control.mr-2(placeholder="Enter Project Name" v-model="pName")
              button.btn.btn-info.btn-md(type="submit" :class="pName==''?'disabled':''") New Project
              //router-link.btn.btn-info.btn-md(:to="'/projects/'+pName" :class="pName==''?'disabled':''") New Project
        .card-body.py-0
          table.table.table-hover
            tbody
              template(v-for="(name, ind) in projects")
                tr
                  td
                    i.material-icons(style="font-size: 1em;") assignment
                    router-link.ml-2(:to="'/projects/'+$route.params.shortcode+'/'+name") {{name}}
</template>

<script>
import Axios from "axios";
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
        this.pName = name;
      },
      get() {
        return this.pName;
      }
    }
  },
  beforeMount() {
    //this.$store.dispatch("getProjects");
    this.$store.commit("SET_SHORT_CODE", this.$route.params.shortcode);
    Axios.get(
      this.$router.options.base +
        "/api/projects/" +
        this.$route.params.shortcode
    )
      .then(res => {
        this.$store.commit("SET_PROJECTS", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    getProject() {
      Axios.get(
        this.$router.options.base +
          "/api/projects/" +
          this.$route.params.shortcode +
          "/" +
          this.pName
      )
        .then(res => {
          if (res.status == 200) {
            let sc = this.$route.params.shortcode;
            let where = "/projects/" + sc + "/" + this.pName;
            this.$router.push(where);
          }
        })
        .catch(err => {
          console.log("Error : ", err);
        });
    }
  }
};
</script>

<style lang="scss">
</style>
