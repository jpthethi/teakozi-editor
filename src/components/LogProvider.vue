<template lang="html">
  <div class="container mt-5" id="input-json">
      <button class="btn btn-info" @click="clickme()">view</button>
      <p>
          Paste your all.json log file below
      </p>
      <textarea class="form-control" v-model="log"></textarea>
      <p v-if="erronous" style="color: red;">
        * Enter Valid JSON
      </p>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      title: "",
      log: "",
      erronous: false,
    }
  },
  methods: {
    clickme: function(){
      this.erronous = true;
      let data = JSON.parse(this.log);
      if(data){
        this.erronous = false;
        this.$router.push({name: "logreport", params: {rawLog:this.log}});
      }
    }
  }
}
</script>

<style lang="css">
</style>
