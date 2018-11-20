<template lang="html">
  <div class="">
    <app-nav-bar/>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: {
    "app-nav-bar": Navbar
  }
};
</script>

<style lang="scss">
body {
  background-color: #fafafa;
}

.box-shadow {
  box-shadow: 0px 0px 14px #888888;
}
</style>
