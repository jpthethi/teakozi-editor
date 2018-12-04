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
                  i.material-icons(style="font-size: 1em;") file
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
    }
  },
  beforeCreate(){
    console.log("Created");
  },
  mount() {
    console.log("Before Destroyed");
    // Axios.get("/api" + this.$route.path)
    //   .then(res => {
    //     console.log("Response data in ProjectDIr : ", JSON.stringify(res.data));
    //     this.$store.commit("SET_CONTENTS", res.data);
    //   })
    //   .catch(err => {
    //     console.log("Error ::: ", err);
    //   });
  }
};
</script>

<style lang="scss">
</style>
