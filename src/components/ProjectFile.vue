<template lang="pug">
  div
    h4 Hello
    codemirror(ref="myCm" :value="code" :options="cmOptions")
</template>
<script>
import {codemirror} from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/theme/base16-light.css";
export default {
  data() {
    return {
      code: "const a = 10",
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-light',
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
    console.log("inside created");
    console.log("this is current codemirror object", codemirror);
  },
  components: {
    codemirror
  }
};
</script>

<style lang="scss">
</style>
