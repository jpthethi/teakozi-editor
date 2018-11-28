<template lang="pug">
  .row
    .col-6
      .card
        .card-header
          nav.navbar.navbar-expand-lg.navbar-light.bg-light.float-right
            ul.navbar-nav
              li.nav-item(v-if="!isEditMode")
                a.nav-link.mr-2(href="" title="Edit File" @click.prevent="isEditMode = !isEditMode;")
                  i.material-icons(style="font-size: 1.5em;") edit
              li.nav-item(v-if="isEditMode")
                a.nav-link.mr-2(href="" title="Save" @click.prevent="saveContent")
                  i.material-icons(style="font-size: 1.5em;") save
        .card-body
          template(v-if="!isEditMode")
            pre(v-highlightjs="code")
              code.javascript
          template(v-if="isEditMode")
            codemirror(ref="myCm" :value="code" :options="cmOptions" @input="onCmChange")
</template>
<script>
import Axios from "axios";
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/base16-light.css";
import "highlight.js/styles/a11y-light.css";

export default {
  data() {
    return {
      isEditMode: false,
      sourceCode: "const c = 23;",
      code: "const a = 10; var b = 12;",
      cmOptions: {
        tabSize: 4,
        mode: "text/javascript",
        theme: "base16-light",
        lineNumbers: true,
        line: true
      }
    };
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror;
    }
  },
  created() {
    this.$store.commit("SET_PATHS", this.$route.path);
    Axios.get(
      "/api/" +
        this.$route.params.projectName +
        "/" +
        this.$route.params.dir +
        "/" +
        this.$route.params.file
    )
      .then(res => {
        console.log("Response : ", res.data);
        this.code = res.data;
      })
      .catch(err => {
        console.log("Error : ", err);
      });
  },
  components: {
    codemirror,
  },
  directives: {
    //highlightjs
  },
  methods: {
    onCmChange(newCode) {
      this.code = newCode;
    },
    saveContent(e) {
      this.isEditMode = !this.isEditMode;
      Axios.post(
        "/api/" +
          this.$route.params.projectName +
          "/" +
          this.$route.params.dir +
          "/" +
          this.$route.params.file,
        { code : this.code}
      )
        .then(res => {
          console.log("Response : ", res);
        })
        .catch(err => {
          console.log("Err : ", err);
        });
    }
  }
};
</script>

<style lang="scss">
</style>
