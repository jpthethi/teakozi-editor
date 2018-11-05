<template lang="html">
  <div class="">
    <app-nav-bar/>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue"
export default {
  components: {
    "app-nav-bar": Navbar
  }
}
</script>

<style lang="scss">
</style>
