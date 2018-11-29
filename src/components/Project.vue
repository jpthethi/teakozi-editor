<template lang="pug">
.container-fluid.mt-2
  //h4
    router-link(:to="'/'+projectName") {{projectName}}
  .row
    .col-6
      .card
        .card-header.pb-0
          .row
            .col-10
              nav
                ol.breadcrumb.bg-light.mb-0
                  template(v-for="(path, ind) in paths")
                    template(v-if="ind == paths.length-1")
                      li.breadcrumb-item.active {{path.name}}
                    template(v-else)
                      li.breadcrumb-item
                        router-link(:to="path.path") {{path.name}}
            .col-2
              nav.navbar.navbar-expand-lg.navbar-light.bg-none.float-right
                ul.navbar-nav
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Create File" @click.prevent="")
                      i.material-icons(style="font-size: 1.5em;") note_add
                  li.nav-item
                    a.nav-link.mr-2(href="" title="Create Folder" @click.prevent="")
                      i.material-icons(style="font-size: 1.5em;") create_new_folder
        .card-body.pb-0
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
  methods: {}
};
</script>
<style lang="scss">
</style>
