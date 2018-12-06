<template lang="pug">
  .row
    .col-12
      table.table.table-hover.mb-0
        tbody
          tr(v-for="(content, ind) in contents")
            td
              .form-group
                template(v-if="content.isFile == false")
                  i.material-icons(style="font-size: 1em;") folder
                template(v-else)
                  i.material-icons(style="font-size: 1em;") insert_drive_file
                router-link.ml-2(:to="$route.path+'/'+content.name") {{content.name}}
</template>

<script>
import Axios from "axios";
export default {
  data() {
    return {};
  },
  computed: {
    contents() {
      return this.$store.state.contents;
    },
    paths() {
      return this.$store.state.paths;
    }    
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    this.$store.commit(
      "SET_PROJECT_NAME",
      this.paths[this.paths.map(e => e.path).indexOf("/projects") + 1].name
    );    
    Axios.get("/api" + this.$route.path)
      .then(res => {
        let contents = res.data;
        this.$store.commit("SET_CONTENTS", contents);
        console.log("response data :::: ", JSON.stringify(contents));
      })
      .catch(err => {
        console.log("Error ::: ", err);
      });
  },
  methods: {}
};
</script>

<style lang="scss">
</style>
